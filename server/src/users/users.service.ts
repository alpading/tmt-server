import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPreference } from './user-preference.entity';
import { FavoriteRestaurant } from '../favorites/favorite-restaurant.entity';
import { FavoriteStay } from '../favorites/favorite-stay.entity';
import { FavoriteActivity } from '../favorites/favorite-activity.entity';
import { NotFoundException } from '../common/exceptions';
import { BadRequestException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { FavoriteDto } from './dto/favorite.dto';
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
    const mgr = this.userRepo.manager;

    const [restaurants, stays, activities] = await Promise.all([
      mgr.query(
        `SELECT fr.id, fr.restaurant_id AS "restaurantId",
                r.name AS "restaurantName", r.image_url AS "restaurantImageUrl",
                ROUND(AVG(rr.overall_rating)::numeric, 1)::float AS "avgRating",
                fr.created_at AS "createdAt"
         FROM favorite_restaurants fr
         JOIN restaurants r ON r.id = fr.restaurant_id
         LEFT JOIN restaurant_ratings rr ON rr.restaurant_id = r.id AND rr.deleted_at IS NULL
         WHERE fr.user_id = $1
         GROUP BY fr.id, fr.restaurant_id, r.name, r.image_url`,
        [userId],
      ),
      mgr.query(
        `SELECT fs.id, fs.stay_id AS "stayId",
                s.name AS "stayName", s.image_url AS "stayImageUrl",
                ROUND(AVG(sr.overall_rating)::numeric, 1)::float AS "avgRating",
                fs.created_at AS "createdAt"
         FROM favorite_stays fs
         JOIN stays s ON s.id = fs.stay_id
         LEFT JOIN stay_ratings sr ON sr.stay_id = s.id AND sr.deleted_at IS NULL
         WHERE fs.user_id = $1
         GROUP BY fs.id, fs.stay_id, s.name, s.image_url`,
        [userId],
      ),
      mgr.query(
        `SELECT fa.id, fa.activity_id AS "activityId",
                a.name AS "activityName", a.image_url AS "activityImageUrl",
                ROUND(AVG(ar.overall_rating)::numeric, 1)::float AS "avgRating",
                fa.created_at AS "createdAt"
         FROM favorite_activities fa
         JOIN activities a ON a.id = fa.activity_id
         LEFT JOIN activity_ratings ar ON ar.activity_id = a.id AND ar.deleted_at IS NULL
         WHERE fa.user_id = $1
         GROUP BY fa.id, fa.activity_id, a.name, a.image_url`,
        [userId],
      ),
    ]);

    return {
      restaurants: restaurants.map((r: any) => ({
        id: r.id,
        restaurantId: r.restaurantId,
        restaurant: { name: r.restaurantName, imageUrl: r.restaurantImageUrl },
        avgRating: r.avgRating,
        createdAt: r.createdAt,
      })),
      stays: stays.map((s: any) => ({
        id: s.id,
        stayId: s.stayId,
        stay: { name: s.stayName, imageUrl: s.stayImageUrl },
        avgRating: s.avgRating,
        createdAt: s.createdAt,
      })),
      activities: activities.map((a: any) => ({
        id: a.id,
        activityId: a.activityId,
        activity: { name: a.activityName, imageUrl: a.activityImageUrl },
        avgRating: a.avgRating,
        createdAt: a.createdAt,
      })),
    };
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
}
