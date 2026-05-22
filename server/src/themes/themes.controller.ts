import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { ThemesService } from './themes.service';

@Controller('theme')
@UseGuards(JwtAuthGuard)
export class ThemesController {
  constructor(private readonly service: ThemesService) {}

  @Get()
  getThemes(@GetUser() user: RequestUser) {
    return this.service.getThemes(user.id);
  }

  @Get(':themeId/district/:districtId')
  getRecommendations(
    @Param('themeId', ParseIntPipe) themeId: number,
    @Param('districtId', ParseIntPipe) districtId: number,
    @GetUser() user: RequestUser,
  ) {
    return this.service.getRecommendations(themeId, districtId, user.id);
  }
}
