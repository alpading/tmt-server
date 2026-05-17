import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stay } from '../../stays/stay.entity';
import { NotFoundException } from '../../common/exceptions';
import { ERROR_CODE } from '../../common/constants/error-codes';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';

@Injectable()
export class AdminStaysService {
  constructor(
    @InjectRepository(Stay)
    private readonly stayRepo: Repository<Stay>,
  ) {}

  async create(dto: CreateStayDto): Promise<Stay> {
    const stay = this.stayRepo.create(dto);
    return this.stayRepo.save(stay);
  }

  async update(id: number, dto: UpdateStayDto): Promise<Stay> {
    const stay = await this.stayRepo.findOne({ where: { id } });
    if (!stay) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 숙소입니다.');
    }
    Object.assign(stay, dto);
    return this.stayRepo.save(stay);
  }

  async remove(id: number): Promise<void> {
    const stay = await this.stayRepo.findOne({ where: { id } });
    if (!stay) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 숙소입니다.');
    }
    await this.stayRepo.softDelete(id);
  }
}
