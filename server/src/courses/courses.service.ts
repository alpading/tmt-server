import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CourseItem } from './course-item.entity';
import { NotFoundException, ForbiddenException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { DomainEnum } from '../common/enums';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseNameDto } from './dto/update-course-name.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CourseItem)
    private readonly courseItemRepo: Repository<CourseItem>,
  ) {}

  async createCourse(userId: number, dto: CreateCourseDto) {
    const course = await this.courseRepo.save(
      this.courseRepo.create({ userId, themeId: dto.themeId, name: dto.name, duration: dto.days }),
    );

    const items: Partial<CourseItem>[] = [];
    let order = 0;

    if (dto.stay) {
      items.push({ courseId: course.id, domain: DomainEnum.STAY, itemId: dto.stay.id, day: 0, itemOrder: order++ });
    }

    for (const daySlot of dto.schedule) {
      for (const r of daySlot.restaurants) {
        items.push({ courseId: course.id, domain: DomainEnum.RESTAURANT, itemId: r.id, day: daySlot.day, itemOrder: order++ });
      }
      if (daySlot.activity) {
        items.push({ courseId: course.id, domain: DomainEnum.ACTIVITY, itemId: daySlot.activity.id, day: daySlot.day, itemOrder: order++ });
      }
    }

    await this.courseItemRepo.save(items);
    return { courseId: course.id };
  }

  async getCourseList(userId: number) {
    const rows: Array<{ id: number; themeId: number; themeName: string; name: string; duration: number; createdAt: Date }> =
      await this.courseRepo.manager.query(
        `SELECT c.id, c.theme_id AS "themeId", COALESCE(t.name, '') AS "themeName", c.name, c.duration, c.created_at AS "createdAt"
         FROM courses c
         LEFT JOIN theme t ON t.id = c.theme_id
         WHERE c.user_id = $1
         ORDER BY c.created_at DESC`,
        [userId],
      );
    return rows.map(({ id, themeId, themeName, name, duration, createdAt }) => ({ id, themeId, themeName, name, duration, createdAt }));
  }

  async getCourse(userId: number, courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (course.userId !== userId) throw new ForbiddenException(ERROR_CODE.FORBIDDEN);

    const rows: Array<{ domain: string; itemId: number; day: number; itemOrder: number; name: string; imageUrl: string; avgRating: number | null }> =
      await this.courseRepo.manager.query(
        `
        SELECT
          ci.domain,
          ci.item_id    AS "itemId",
          ci.day,
          ci.item_order AS "itemOrder",
          COALESCE(r.name, s.name, a.name)                AS name,
          COALESCE(r.image_url, s.image_url, a.image_url) AS "imageUrl",
          ROUND(COALESCE(
            AVG(rr.overall_rating),
            AVG(sr.overall_rating),
            AVG(ar.overall_rating)
          )::numeric, 1)::float AS "avgRating"
        FROM course_items ci
        LEFT JOIN restaurants r  ON ci.domain = 'restaurant' AND r.id  = ci.item_id
        LEFT JOIN stays s        ON ci.domain = 'stay'       AND s.id  = ci.item_id
        LEFT JOIN activities a   ON ci.domain = 'activity'   AND a.id  = ci.item_id
        LEFT JOIN restaurant_ratings rr ON ci.domain = 'restaurant' AND rr.restaurant_id = ci.item_id AND rr.deleted_at IS NULL
        LEFT JOIN stay_ratings sr       ON ci.domain = 'stay'       AND sr.stay_id       = ci.item_id AND sr.deleted_at IS NULL
        LEFT JOIN activity_ratings ar   ON ci.domain = 'activity'   AND ar.activity_id   = ci.item_id AND ar.deleted_at IS NULL
        WHERE ci.course_id = $1
        GROUP BY ci.domain, ci.item_id, ci.day, ci.item_order,
                 r.name, r.image_url, s.name, s.image_url, a.name, a.image_url
        ORDER BY ci.item_order
        `,
        [courseId],
      );

    const stayRow = rows.find((r) => r.domain === 'stay');
    const stay = stayRow ? { id: stayRow.itemId, name: stayRow.name, imageUrl: stayRow.imageUrl, avgRating: stayRow.avgRating } : null;

    const dayMap = new Map<number, { restaurants: object[]; activity: object | null }>();
    for (let d = 1; d <= course.duration; d++) dayMap.set(d, { restaurants: [], activity: null });

    for (const row of rows) {
      if (row.domain === 'stay') continue;
      const slot = dayMap.get(row.day);
      if (!slot) continue;
      const item = { id: row.itemId, name: row.name, imageUrl: row.imageUrl, avgRating: row.avgRating };
      if (row.domain === 'restaurant') slot.restaurants.push(item);
      else slot.activity = item;
    }

    const schedule = Array.from(dayMap.entries()).map(([day, slot]) => ({ day, ...slot }));
    const themeRows = await this.courseRepo.manager.query(
      `SELECT name FROM theme WHERE id = $1`,
      [course.themeId],
    );
    const themeName: string = themeRows[0]?.name ?? '';
    return { id: course.id, themeId: course.themeId, themeName, name: course.name, duration: course.duration, createdAt: course.createdAt, stay, schedule };
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
