import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { ActivitiesService } from './activities.service';
import { CreateActivityRatingDto } from './dto/create-activity-rating.dto';
import { SearchActivityDto } from './dto/search-activity.dto';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get('filters/basic')
  getBasicFilters() {
    return this.service.getBasicFilters();
  }

  @Get('search/district/:districtId')
  searchByDistrict(
    @Param('districtId', ParseIntPipe) districtId: number,
    @Query() dto: SearchActivityDto,
  ) {
    return this.service.searchByDistrict(districtId, dto);
  }

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateActivityRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
