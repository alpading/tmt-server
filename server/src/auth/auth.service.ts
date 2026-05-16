import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserPreference } from '../users/user-preference.entity';
import { User } from '../users/user.entity';
import { BadRequestException, NotFoundException } from '../common/exceptions';
import { ERROR_CODE } from '../common/constants/error-codes';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserPreference)
    private readonly prefRepo: Repository<UserPreference>,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByLoginId(dto.loginId);
    if (existing) {
      throw new BadRequestException(ERROR_CODE.DUPLICATE_LOGIN_ID, '이미 사용 중인 아이디입니다.');
    }

    const hashedPw = await bcrypt.hash(dto.password, 10);

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = manager.create(User, {
        loginId: dto.loginId,
        hashedPw,
        name: dto.name,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender,
        mbti: dto.mbti,
        hormone: dto.hormone,
      });
      const savedUser = await manager.save(newUser);

      const pref = manager.create(UserPreference, {
        userId: savedUser.id,
        ...dto.preferences,
      });
      await manager.save(pref);

      return savedUser;
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByLoginId(dto.loginId);
    if (!user) {
      throw new NotFoundException(ERROR_CODE.RESOURCE_NOT_FOUND, '존재하지 않는 아이디입니다.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.hashedPw);
    if (!isMatch) {
      throw new BadRequestException(ERROR_CODE.INVALID_CREDENTIALS, '비밀번호가 올바르지 않습니다.');
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: number };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new BadRequestException(ERROR_CODE.INVALID_TOKEN, '유효하지 않은 토큰입니다.');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user?.refreshToken) {
      throw new BadRequestException(ERROR_CODE.INVALID_TOKEN, '유효하지 않은 토큰입니다.');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new BadRequestException(ERROR_CODE.INVALID_TOKEN, '유효하지 않은 토큰입니다.');
    }

    return this.issueTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'ok' };
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' },
    );

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, role: user.role },
    };
  }
}
