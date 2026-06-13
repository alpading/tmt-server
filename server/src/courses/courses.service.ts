import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { NotFoundException, ForbiddenException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseNameDto } from './dto/update-course-name.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async createCourse(userId: number, dto: CreateCourseDto) {
    const course = await this.courseRepo.save(
      this.courseRepo.create({ userId, themeId: dto.themeId, name: dto.name, duration: dto.days }),
    );

    const mgr = this.courseRepo.manager;

    if (dto.stay) {
      await mgr.query(
        `INSERT INTO course_stays (course_id, stay_id, day_number) VALUES ($1, $2, 0)`,
        [course.id, dto.stay.id],
      );
    }

    for (const daySlot of dto.schedule) {
      let order = 0;
      for (const r of daySlot.restaurants) {
        await mgr.query(
          `INSERT INTO course_restaurants (course_id, restaurant_id, day_number, item_order) VALUES ($1, $2, $3, $4)`,
          [course.id, r.id, daySlot.day, order++],
        );
      }
      if (daySlot.activity) {
        await mgr.query(
          `INSERT INTO course_activities (course_id, activity_id, day_number) VALUES ($1, $2, $3)`,
          [course.id, daySlot.activity.id, daySlot.day],
        );
      }
    }

    return { courseId: course.id };
  }

  async getCourseList(userId: number) {
    const rows: Array<{ id: number; themeId: number; themeName: string; name: string; duration: number; createdAt: Date }> =
      await this.courseRepo.manager.query(
        `SELECT c.id, c.theme_id AS "themeId", COALESCE(t.name, '') AS "themeName",
                c.name, c.duration, c.created_at AS "createdAt"
         FROM courses c
         LEFT JOIN themes t ON t.id = c.theme_id
         WHERE c.user_id = $1
         ORDER BY c.created_at DESC`,
        [userId],
      );
    return rows;
  }

  async getCourse(userId: number, courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (course.userId !== userId) throw new ForbiddenException(ERROR_CODE.FORBIDDEN);

    const mgr = this.courseRepo.manager;

    const [stayRows, restaurantRows, activityRows, themeRows] = await Promise.all([
      mgr.query<Array<{ itemId: number; name: string; imageUrl: string; avgRating: number | null }>>(
        `SELECT cs.stay_id AS "itemId", s.name, s.image_url AS "imageUrl",
                ROUND(AVG(sr.overall_rating)::numeric, 1)::float AS "avgRating"
         FROM course_stays cs
         JOIN stays s ON s.id = cs.stay_id
         LEFT JOIN stay_ratings sr ON sr.stay_id = s.id AND sr.deleted_at IS NULL
         WHERE cs.course_id = $1
         GROUP BY cs.stay_id, s.name, s.image_url`,
        [courseId],
      ),
      mgr.query<Array<{ itemId: number; day: number; name: string; imageUrl: string; avgRating: number | null }>>(
        `SELECT cr.restaurant_id AS "itemId", cr.day_number AS day,
                r.name, r.image_url AS "imageUrl",
                ROUND(AVG(rr.overall_rating)::numeric, 1)::float AS "avgRating"
         FROM course_restaurants cr
         JOIN restaurants r ON r.id = cr.restaurant_id
         LEFT JOIN restaurant_ratings rr ON rr.restaurant_id = r.id AND rr.deleted_at IS NULL
         WHERE cr.course_id = $1
         GROUP BY cr.restaurant_id, cr.day_number, cr.item_order, r.name, r.image_url
         ORDER BY cr.day_number, cr.item_order`,
        [courseId],
      ),
      mgr.query<Array<{ itemId: number; day: number; name: string; imageUrl: string; avgRating: number | null }>>(
        `SELECT ca.activity_id AS "itemId", ca.day_number AS day,
                a.name, a.image_url AS "imageUrl",
                ROUND(AVG(ar.overall_rating)::numeric, 1)::float AS "avgRating"
         FROM course_activities ca
         JOIN activities a ON a.id = ca.activity_id
         LEFT JOIN activity_ratings ar ON ar.activity_id = a.id AND ar.deleted_at IS NULL
         WHERE ca.course_id = $1
         GROUP BY ca.activity_id, ca.day_number, a.name, a.image_url`,
        [courseId],
      ),
      mgr.query<Array<{ name: string }>>(
        `SELECT name FROM themes WHERE id = $1`,
        [course.themeId],
      ),
    ]);

    const stay = stayRows[0]
      ? { id: stayRows[0].itemId, name: stayRows[0].name, imageUrl: stayRows[0].imageUrl, avgRating: stayRows[0].avgRating }
      : null;

    const dayMap = new Map<number, { restaurants: object[]; activity: object | null }>();
    for (let d = 1; d <= course.duration; d++) dayMap.set(d, { restaurants: [], activity: null });

    for (const row of restaurantRows) {
      const slot = dayMap.get(row.day);
      if (slot) slot.restaurants.push({ id: row.itemId, name: row.name, imageUrl: row.imageUrl, avgRating: row.avgRating });
    }
    for (const row of activityRows) {
      const slot = dayMap.get(row.day);
      if (slot) slot.activity = { id: row.itemId, name: row.name, imageUrl: row.imageUrl, avgRating: row.avgRating };
    }

    const schedule = Array.from(dayMap.entries()).map(([day, slot]) => ({ day, ...slot }));
    const themeName: string = themeRows[0]?.name ?? '';

    return {
      id: course.id,
      themeId: course.themeId,
      themeName,
      name: course.name,
      duration: course.duration,
      createdAt: course.createdAt,
      stay,
      schedule,
    };
  }

  async updateCourseName(userId: number, dto: UpdateCourseNameDto) {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (course.userId !== userId) throw new ForbiddenException(ERROR_CODE.FORBIDDEN);
    course.name = dto.name;
    return this.courseRepo.save(course);
  }

  async deleteCourse(userId: number, dto: DeleteCourseDto) {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (course.userId !== userId) throw new ForbiddenException(ERROR_CODE.FORBIDDEN);
    await this.courseRepo.remove(course);
  }
}
