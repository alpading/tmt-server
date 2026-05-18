import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stay } from './stay.entity';
import { StayRating } from './stay-rating.entity';
import { StaysController } from './stays.controller';
import { StaysService } from './stays.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stay, StayRating]), UsersModule],
  controllers: [StaysController],
  providers: [StaysService],
})
export class StaysModule {}
