import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { StaysService } from './stays.service';
import { CreateStayRatingDto } from './dto/create-stay-rating.dto';

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

  @Post('rating')
  @HttpCode(201)
  createRating(@GetUser() user: RequestUser, @Body() dto: CreateStayRatingDto) {
    return this.service.createRating(user.id, dto);
  }
}
