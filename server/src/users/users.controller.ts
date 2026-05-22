import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

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
}
