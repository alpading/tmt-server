import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceCategory } from './preference-category.entity';
import { Preference } from './preference.entity';
import { PreferenceQuestion } from './preference-question.entity';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceCategory, Preference, PreferenceQuestion])],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}
