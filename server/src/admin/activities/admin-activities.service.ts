import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../activities/activity.entity';
import { NotFoundException } from '../../common/exceptions';
import { ERROR_CODE } from '../../common/constants/error-codes';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class AdminActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepo.create(dto);
    return this.activityRepo.save(activity);
  }

  async update(id: number, dto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 액티비티입니다.');
    }
    Object.assign(activity, dto);
    return this.activityRepo.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 액티비티입니다.');
    }
    await this.activityRepo.softDelete(id);
  }
}
