import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantRating } from './restaurant-rating.entity';
import { RestaurantCategory } from './restaurant-category.entity';
import { AttributeMapping } from '../preferences/attribute-mapping.entity';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, RestaurantRating, RestaurantCategory, AttributeMapping]), UsersModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
