import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private readonly service: RestaurantsService) {}

  @Get('filters/basic')
  getBasicFilters() {
    return this.service.getBasicFilters();
  }

  @Get('filters/categories')
  getCategories() {
    return this.service.getCategories();
  }

  @Get(':restaurantId')
  findOne(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.service.findOne(restaurantId);
  }

  @Get('search/district/:districtId')
  searchByDistrict(
    @Param('districtId', ParseIntPipe) districtId: number,
    @Query() dto: SearchRestaurantDto,
  ) {
    return this.service.searchByDistrict(districtId, dto);
  }

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateRestaurantRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
