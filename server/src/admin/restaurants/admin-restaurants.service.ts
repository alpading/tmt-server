import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../restaurants/restaurant.entity';
import { NotFoundException } from '../../common/exceptions';
import { ERROR_CODE } from '../../common/constants/error-codes';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class AdminRestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepo.create(dto);
    return this.restaurantRepo.save(restaurant);
  }

  async update(id: number, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 식당입니다.');
    }
    Object.assign(restaurant, dto);
    return this.restaurantRepo.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 식당입니다.');
    }
    await this.restaurantRepo.softDelete(id);
  }
}
