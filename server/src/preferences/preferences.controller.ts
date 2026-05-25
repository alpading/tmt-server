import { Controller, Get, Param, ParseEnumPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DomainEnum } from '../common/enums';
import { PreferencesService } from './preferences.service';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly service: PreferencesService) {}

  /** 성향 질문 목록 (공개 — 회원가입 전에도 호출 가능) */
  @Get('questions')
  getQuestions() {
    return this.service.getQuestions();
  }

  @Get('filters/:domain')
  @UseGuards(JwtAuthGuard)
  getFiltersByDomain(@Param('domain', new ParseEnumPipe(DomainEnum)) domain: DomainEnum) {
    return this.service.getFiltersByDomain(domain);
  }
}
