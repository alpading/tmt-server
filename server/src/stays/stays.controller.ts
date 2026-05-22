import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { StaysService } from './stays.service';
import { CreateStayRatingDto } from './dto/create-stay-rating.dto';
import { SearchStayDto } from './dto/search-stay.dto';

@Controller('stays')
@UseGuards(JwtAuthGuard)
export class StaysController {
  constructor(private readonly service: StaysService) {}

  @Get('filters/basic')
  getBasicFilters() {
    return this.service.getBasicFilters();
  }

  @Get('filters/categories')
  getCategories() {
    return this.service.getCategories();
  }

  @Get(':stayId')
  findOne(@Param('stayId', ParseIntPipe) stayId: number) {
    return this.service.findOne(stayId);
  }

  @Get('search/district/:districtId')
  searchByDistrict(
    @Param('districtId', ParseIntPipe) districtId: number,
    @Query() dto: SearchStayDto,
  ) {
    return this.service.searchByDistrict(districtId, dto);
  }

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateStayRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
