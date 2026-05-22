import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { ThemeMapping } from './theme-mapping.entity';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Theme, ThemeMapping]), UsersModule],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
