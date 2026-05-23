import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Province) private readonly provinceRepo: Repository<Province>,
    @InjectRepository(District) private readonly districtRepo: Repository<District>,
  ) {}

  async getProvinces(): Promise<{ id: number; name: string }[]> {
    const rows = await this.provinceRepo.find({ order: { id: 'ASC' } });
    return rows.map((p) => ({ id: p.id, name: p.name }));
  }

  async getDistricts(provinceId: number): Promise<{ id: number; name: string }[]> {
    const province = await this.provinceRepo.findOne({ where: { id: provinceId } });
    if (!province) throw new NotFoundException('province not found');

    const rows = await this.districtRepo.find({
      where: { provinceId },
      order: { id: 'ASC' },
    });
    return rows.map((d) => ({ id: d.id, name: d.name }));
  }
}
