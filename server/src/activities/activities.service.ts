import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityRating } from './activity-rating.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateActivityRatingDto } from './dto/create-activity-rating.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityRating)
    private readonly ratingRepo: Repository<ActivityRating>,
    private readonly usersService: UsersService,
  ) {}

  async createRating(userId: number, dto: CreateActivityRatingDto): Promise<ActivityRating> {
    const activity = await this.activityRepo.findOne({ where: { id: dto.activityId } });
    if (!activity) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 액티비티입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      activityId: dto.activityId,
      overallRating: dto.overallRating,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
      actCultureSnap: pref.actCulture,
      actViewSnap: pref.actView,
      actHealingSnap: pref.actHealing,
      actActiveSnap: pref.actActive,
    });

    return this.ratingRepo.save(rating);
  }
}
