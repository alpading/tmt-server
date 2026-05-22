import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum, HormoneEnum, MbtiEnum } from '../../common/enums';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @IsEnum(MbtiEnum)
  @IsOptional()
  mbti?: MbtiEnum;

  @IsEnum(HormoneEnum)
  @IsOptional()
  hormone?: HormoneEnum;
}
