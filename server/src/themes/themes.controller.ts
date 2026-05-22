import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { ThemesService } from './themes.service';

class RecommendationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  days: number = 1;
}

@Controller('theme')
@UseGuards(JwtAuthGuard)
export class ThemesController {
  constructor(private readonly service: ThemesService) {}

  @Get('list')
  getThemes(@GetUser() user: RequestUser) {
    return this.service.getThemes(user.id);
  }

  @Get(':themeId/district/:districtId')
  getRecommendations(
    @Param('themeId', ParseIntPipe) themeId: number,
    @Param('districtId', ParseIntPipe) districtId: number,
    @Query() query: RecommendationQuery,
    @GetUser() user: RequestUser,
  ) {
    return this.service.getRecommendations(themeId, districtId, query.days, user.id);
  }
}
