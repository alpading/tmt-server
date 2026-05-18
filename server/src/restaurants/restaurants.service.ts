import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantRating } from './restaurant-rating.entity';
import { RestaurantCategory } from './restaurant-category.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';

const RESTAURANT_BASIC_FILTERS = [
  { key: 'hasParking',        label: '주차' },
  { key: 'hasSingleSeating',  label: '혼밥 전용 공간' },
  { key: 'allowsPets',        label: '애견 동반' },
  { key: 'hasTableSeating',   label: '입식' },
  { key: 'hasFloorSeating',   label: '좌식' },
  { key: 'hasBarTable',       label: '바테이블' },
  { key: 'hasBabyChair',      label: '유아 의자' },
  { key: 'hasGroupSeating',   label: '단체석' },
  { key: 'hasPrivateRoom',    label: '룸' },
] as const;

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(RestaurantRating)
    private readonly ratingRepo: Repository<RestaurantRating>,
    @InjectRepository(RestaurantCategory)
    private readonly categoryRepo: Repository<RestaurantCategory>,
    private readonly usersService: UsersService,
  ) {}

  getBasicFilters() {
    return RESTAURANT_BASIC_FILTERS;
  }

  getCategories() {
    return this.categoryRepo.find({ select: { id: true, name: true }, order: { id: 'ASC' } });
  }

  async createRating(userId: number, dto: CreateRestaurantRatingDto): Promise<RestaurantRating> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id: dto.restaurantId } });
    if (!restaurant) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 식당입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      restaurantId: dto.restaurantId,
      overallRating: dto.overallRating,
      spaceRating: dto.spaceRating,
      tasteRating: dto.tasteRating,
      visitPartySize: dto.visitPartySize,
      totalSpentAmount: dto.totalSpentAmount,
      resOilySnap: pref.resOily,
      resMildSnap: pref.resMild,
      resCleanSnap: pref.resClean,
      resStimSnap: pref.resStim,
      resSpicySnap: pref.resSpicy,
      resNoiseSnap: pref.resNoise,
      resInteriorSnap: pref.resInterior,
      resServiceSnap: pref.resService,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
    });

    return this.ratingRepo.save(rating);
  }
}
