import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';
import { GenderEnum, HormoneEnum, MbtiEnum } from '../../common/enums';

export class PreferencesDto {
  @IsInt() @Min(1) @Max(3) resOily: number;
  @IsInt() @Min(1) @Max(3) resClean: number;
  @IsInt() @Min(1) @Max(3) resStim: number;
  @IsInt() @Min(1) @Max(3) resSpicy: number;
  @IsInt() @Min(1) @Max(3) resNoise: number;
  @IsInt() @Min(1) @Max(3) resInterior: number;
  @IsInt() @Min(1) @Max(3) resService: number;
  @IsInt() @Min(1) @Max(3) stayView: number;
  @IsInt() @Min(1) @Max(3) stayInterior: number;
  @IsInt() @Min(1) @Max(3) staySpace: number;
  @IsInt() @Min(1) @Max(3) stayNoise: number;
  @IsInt() @Min(1) @Max(3) stayClean: number;
  @IsInt() @Min(1) @Max(3) stayService: number;
  @IsInt() @Min(1) @Max(3) actCulture: number;
  @IsInt() @Min(1) @Max(3) actView: number;
  @IsInt() @Min(1) @Max(3) actHealing: number;
  @IsInt() @Min(1) @Max(3) actActive: number;
}

export class SignupDto {
  @IsString() loginId: string;
  @IsString() @MinLength(6) password: string;
  @IsString() name: string;
  @IsDateString() birthDate: string;
  @IsEnum(GenderEnum) gender: GenderEnum;
  @IsEnum(MbtiEnum) mbti: MbtiEnum;
  @IsEnum(HormoneEnum) hormone: HormoneEnum;

  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto;
}
