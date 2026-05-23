import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegionsService } from './regions.service';

@Controller('regions')
@UseGuards(JwtAuthGuard)
export class RegionsController {
  constructor(private readonly service: RegionsService) {}

  /** GET /api/regions — 시/도 목록 */
  @Get()
  getProvinces() {
    return this.service.getProvinces();
  }

  /** GET /api/regions/:provinceId/districts — 시/군/구 목록 */
  @Get(':provinceId/districts')
  getDistricts(@Param('provinceId', ParseIntPipe) provinceId: number) {
    return this.service.getDistricts(provinceId);
  }
}
