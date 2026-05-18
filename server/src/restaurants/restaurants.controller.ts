import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private readonly service: RestaurantsService) {}

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateRestaurantRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
