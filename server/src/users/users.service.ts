import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPreference } from './user-preference.entity';
import { NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserPreference)
    private readonly prefRepo: Repository<UserPreference>,
  ) {}

  findByLoginId(loginId: string) {
    return this.userRepo.findOne({ where: { loginId } });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  findPreferencesByUserId(userId: number) {
    return this.prefRepo.findOne({ where: { userId } });
  }

  updateRefreshToken(id: number, refreshToken: string | null) {
    return this.userRepo.update(id, { refreshToken });
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    const { hashedPw, refreshToken, deletedAt, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    Object.assign(user, dto);
    await this.userRepo.save(user);
    const { hashedPw, refreshToken, deletedAt, ...profile } = user;
    return profile;
  }

  async getPreference(userId: number) {
    const pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    return pref;
  }

  async updatePreference(userId: number, dto: UpdatePreferenceDto) {
    const pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND);
    Object.assign(pref, dto);
    return this.prefRepo.save(pref);
  }
}
