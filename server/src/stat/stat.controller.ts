import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DomainEnum } from '../common/enums';
import { StatService } from './stat.service';

@Controller('stat')
@UseGuards(JwtAuthGuard)
export class StatController {
  constructor(private readonly service: StatService) {}

  @Get(':domain/:itemId/mbti')
  getMbti(
    @Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.getMbtiStat(domain, itemId);
  }

  @Get(':domain/:itemId/hormone')
  getHormone(
    @Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.getHormoneStat(domain, itemId);
  }

  @Get(':domain/:itemId/overall')
  getOverall(
    @Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.getOverallStat(domain, itemId);
  }

  @Get(':domain/:itemId/preference')
  getPreference(
    @Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.getPreferenceStat(domain, itemId);
  }
}
