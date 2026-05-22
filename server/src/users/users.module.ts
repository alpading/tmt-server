import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserPreference } from './user-preference.entity';
import { FavoriteRestaurant } from '../favorites/favorite-restaurant.entity';
import { FavoriteStay } from '../favorites/favorite-stay.entity';
import { FavoriteActivity } from '../favorites/favorite-activity.entity';
import { Course } from '../courses/course.entity';
import { CourseItem } from '../courses/course-item.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference, FavoriteRestaurant, FavoriteStay, FavoriteActivity, Course, CourseItem])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
