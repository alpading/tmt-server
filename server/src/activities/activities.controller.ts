import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { ActivitiesService } from './activities.service';
import { CreateActivityRatingDto } from './dto/create-activity-rating.dto';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get('filters/basic')
  getBasicFilters() {
    return this.service.getBasicFilters();
  }

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateActivityRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
