import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceCategory } from './preference-category.entity';
import { AttributeMapping } from './attribute-mapping.entity';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceCategory, AttributeMapping])],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}
