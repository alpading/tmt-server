import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantRating } from './restaurant-rating.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(RestaurantRating)
    private readonly ratingRepo: Repository<RestaurantRating>,
    private readonly usersService: UsersService,
  ) {}

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
