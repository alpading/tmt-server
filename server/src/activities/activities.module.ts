import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivityRating } from './activity-rating.entity';
import { AttributeMapping } from '../preferences/attribute-mapping.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityRating, AttributeMapping]), UsersModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
