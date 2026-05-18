import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stay } from './stay.entity';
import { StayRating } from './stay-rating.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { CreateStayRatingDto } from './dto/create-stay-rating.dto';

@Injectable()
export class StaysService {
  constructor(
    @InjectRepository(Stay)
    private readonly stayRepo: Repository<Stay>,
    @InjectRepository(StayRating)
    private readonly ratingRepo: Repository<StayRating>,
    private readonly usersService: UsersService,
  ) {}

  async createRating(userId: number, dto: CreateStayRatingDto): Promise<StayRating> {
    const stay = await this.stayRepo.findOne({ where: { id: dto.stayId } });
    if (!stay) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 숙소입니다.');
    }

    const [user, pref] = await Promise.all([
      this.usersService.findById(userId),
      this.usersService.findPreferencesByUserId(userId),
    ]);

    const rating = this.ratingRepo.create({
      userId,
      stayId: dto.stayId,
      overallRating: dto.overallRating,
      interiorRating: dto.interiorRating,
      cleanRating: dto.cleanRating,
      visitPartySize: dto.visitPartySize,
      totalSpentAmount: dto.totalSpentAmount,
      stayViewSnap: pref.stayView,
      stayInteriorSnap: pref.stayInterior,
      staySpaceSnap: pref.staySpace,
      stayNoiseSnap: pref.stayNoise,
      stayCleanSnap: pref.stayClean,
      stayServiceSnap: pref.stayService,
      mbtiSnap: user.mbti,
      hormoneSnap: user.hormone,
    });

    return this.ratingRepo.save(rating);
  }
}
