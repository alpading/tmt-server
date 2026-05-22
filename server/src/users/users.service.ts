import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPreference } from './user-preference.entity';
import { FavoriteRestaurant } from '../favorites/favorite-restaurant.entity';
import { FavoriteStay } from '../favorites/favorite-stay.entity';
import { FavoriteActivity } from '../favorites/favorite-activity.entity';
import { Course } from '../courses/course.entity';
import { CourseItem } from '../courses/course-item.entity';
import { NotFoundException } from '../common/exceptions';
import { BadRequestException } from '../common/exceptions';
import { ForbiddenException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseNameDto } from './dto/update-course-name.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';
import { DomainEnum } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserPreference)
    private readonly prefRepo: Repository<UserPreference>,
    @InjectRepository(FavoriteRestaurant)
    private readonly favRestaurantRepo: Repository<FavoriteRestaurant>,
    @InjectRepository(FavoriteStay)
    private readonly favStayRepo: Repository<FavoriteStay>,
    @InjectRepository(FavoriteActivity)
    private readonly favActivityRepo: Repository<FavoriteActivity>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CourseItem)
    private readonly courseItemRepo: Repository<CourseItem>,
  ) {}

  findByLoginId(loginId: string) {
    return this.userRepo.findOne({ where: { loginId } });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  findPreferencesByUserId(userId: number) {
    return this.prefRepo.findOne({ where: { userId } });
  }

  updateRefreshToken(id: number, refreshToken: string | null) {
    return this.userRepo.update(id, { refreshToken });
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    const { hashedPw, refreshToken, deletedAt, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    Object.assign(user, dto);
    await this.userRepo.save(user);
    const { hashedPw, refreshToken, deletedAt, ...profile } = user;
    return profile;
  }

  async getPreference(userId: number) {
    const pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    return pref;
  }

  async updatePreference(userId: number, dto: UpdatePreferenceDto) {
    const pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    Object.assign(pref, dto);
    return this.prefRepo.save(pref);
  }

  async addFavorite(userId: number, dto: FavoriteDto) {
    const { domain, itemId } = dto;

    if (domain === DomainEnum.RESTAURANT) {
      const exists = await this.favRestaurantRepo.findOne({ where: { userId, restaurantId: itemId } });
      if (exists) throw new BadRequestException(ERROR_CODE.ALREADY_EXISTS, '이미 저장된 장소입니다.');
      return this.favRestaurantRepo.save(this.favRestaurantRepo.create({ userId, restaurantId: itemId }));
    }
    if (domain === DomainEnum.STAY) {
      const exists = await this.favStayRepo.findOne({ where: { userId, stayId: itemId } });
      if (exists) throw new BadRequestException(ERROR_CODE.ALREADY_EXISTS, '이미 저장된 장소입니다.');
      return this.favStayRepo.save(this.favStayRepo.create({ userId, stayId: itemId }));
    }
    const exists = await this.favActivityRepo.findOne({ where: { userId, activityId: itemId } });
    if (exists) throw new BadRequestException(ERROR_CODE.ALREADY_EXISTS, '이미 저장된 장소입니다.');
    return this.favActivityRepo.save(this.favActivityRepo.create({ userId, activityId: itemId }));
  }

  async getFavorites(userId: number) {
    const [restaurants, stays, activities] = await Promise.all([
      this.favRestaurantRepo.find({
        where: { userId },
        relations: { restaurant: true },
        select: { id: true, restaurantId: true, restaurant: { name: true, imageUrl: true } },
      }),
      this.favStayRepo.find({
        where: { userId },
        relations: { stay: true },
        select: { id: true, stayId: true, stay: { name: true, imageUrl: true } },
      }),
      this.favActivityRepo.find({
        where: { userId },
        relations: { activity: true },
        select: { id: true, activityId: true, activity: { name: true, imageUrl: true } },
      }),
    ]);
    return { restaurants, stays, activities };
  }

  async removeFavorite(userId: number, dto: FavoriteDto) {
    const { domain, itemId } = dto;

    if (domain === DomainEnum.RESTAURANT) {
      const row = await this.favRestaurantRepo.findOne({ where: { userId, restaurantId: itemId } });
      if (!row) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
      return this.favRestaurantRepo.remove(row);
    }
    if (domain === DomainEnum.STAY) {
      const row = await this.favStayRepo.findOne({ where: { userId, stayId: itemId } });
      if (!row) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
      return this.favStayRepo.remove(row);
    }
    const row = await this.favActivityRepo.findOne({ where: { userId, activityId: itemId } });
    if (!row) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    return this.favActivityRepo.remove(row);
  }

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
    const courses = await this.courseRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return courses.map(({ id, themeId, name, duration, createdAt }) => ({ id, themeId, name, duration, createdAt }));
  }

  async getCourse(userId: number, courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    if (course.userId !== userId) throw new ForbiddenException(ERROR_CODE.FORBIDDEN);

    const rows: Array<{ domain: string; itemId: number; day: number; itemOrder: number; name: string; imageUrl: string }> =
      await this.courseRepo.manager.query(
        `
        SELECT
          ci.domain,
          ci.item_id    AS "itemId",
          ci.day,
          ci.item_order AS "itemOrder",
          COALESCE(r.name, s.name, a.name)          AS name,
          COALESCE(r.image_url, s.image_url, a.image_url) AS "imageUrl"
        FROM course_items ci
        LEFT JOIN restaurants r  ON ci.domain = 'restaurant' AND r.id  = ci.item_id
        LEFT JOIN stays s        ON ci.domain = 'stay'       AND s.id  = ci.item_id
        LEFT JOIN activities a   ON ci.domain = 'activity'   AND a.id  = ci.item_id
        WHERE ci.course_id = $1
        ORDER BY ci.item_order
        `,
        [courseId],
      );

    const stayRow = rows.find((r) => r.domain === 'stay');
    const stay = stayRow ? { id: stayRow.itemId, name: stayRow.name, imageUrl: stayRow.imageUrl } : null;

    const dayMap = new Map<number, { restaurants: object[]; activity: object | null }>();
    for (let d = 1; d <= course.duration; d++) dayMap.set(d, { restaurants: [], activity: null });

    for (const row of rows) {
      if (row.domain === 'stay') continue;
      const slot = dayMap.get(row.day);
      if (!slot) continue;
      const item = { id: row.itemId, name: row.name, imageUrl: row.imageUrl };
      if (row.domain === 'restaurant') slot.restaurants.push(item);
      else slot.activity = item;
    }

    const schedule = Array.from(dayMap.entries()).map(([day, slot]) => ({ day, ...slot }));
    return { id: course.id, themeId: course.themeId, name: course.name, duration: course.duration, createdAt: course.createdAt, stay, schedule };
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
