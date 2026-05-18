import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPreference } from './user-preference.entity';

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
}
