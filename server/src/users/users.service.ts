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
}
