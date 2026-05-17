import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Stay } from '../stays/stay.entity';
import { Activity } from '../activities/activity.entity';
import { AdminRestaurantsController } from './restaurants/admin-restaurants.controller';
import { AdminRestaurantsService } from './restaurants/admin-restaurants.service';
import { AdminStaysController } from './stays/admin-stays.controller';
import { AdminStaysService } from './stays/admin-stays.service';
import { AdminActivitiesController } from './activities/admin-activities.controller';
import { AdminActivitiesService } from './activities/admin-activities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Stay, Activity])],
  controllers: [AdminRestaurantsController, AdminStaysController, AdminActivitiesController],
  providers: [AdminRestaurantsService, AdminStaysService, AdminActivitiesService],
})
export class AdminModule {}
