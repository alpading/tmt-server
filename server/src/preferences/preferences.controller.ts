import { Controller, Get, Param, ParseEnumPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DomainEnum } from '../common/enums';
import { PreferencesService } from './preferences.service';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  @Get('filters/:domain')
  getFiltersByDomain(@Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum) {
    return this.service.getFiltersByDomain(domain);
  }
}
