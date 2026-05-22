import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivityRating } from './activity-rating.entity';
import { Preference } from '../preferences/preference.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityRating, Preference]), UsersModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
