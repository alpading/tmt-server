import { Body, Controller, Delete, Get, HttpCode, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { FavoriteDto } from './dto/favorite.dto';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  getProfile(@GetUser() user: RequestUser) {
    return this.service.getProfile(user.id);
  }

  @Put()
  updateProfile(@GetUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(user.id, dto);
  }

  @Get('preference')
  getPreference(@GetUser() user: RequestUser) {
    return this.service.getPreference(user.id);
  }

  @Put('preference')
  updatePreference(@GetUser() user: RequestUser, @Body() dto: UpdatePreferenceDto) {
    return this.service.updatePreference(user.id, dto);
  }

  @Post('favorites')
  @HttpCode(201)
  addFavorite(@GetUser() user: RequestUser, @Body() dto: FavoriteDto) {
    return this.service.addFavorite(user.id, dto);
  }

  @Get('favorites/list')
  getFavorites(@GetUser() user: RequestUser) {
    return this.service.getFavorites(user.id);
  }

  @Delete('favorites')
  @HttpCode(200)
  removeFavorite(@GetUser() user: RequestUser, @Body() dto: FavoriteDto) {
    return this.service.removeFavorite(user.id, dto);
  }

  @Delete()
  @HttpCode(204)
  deleteAccount(@GetUser() user: RequestUser) {
    return this.service.deleteAccount(user.id);
  }
}
