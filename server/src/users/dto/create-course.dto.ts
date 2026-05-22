import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min, ValidateNested } from 'class-validator';

class ItemRefDto {
  @IsInt()
  @IsPositive()
  id: number;
}

class ScheduleDayDto {
  @IsInt()
  @Min(1)
  day: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRefDto)
  restaurants: ItemRefDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemRefDto)
  activity?: ItemRefDto;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  themeId: number;

  @IsInt()
  @Min(1)
  @Max(3)
  days: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemRefDto)
  stay?: ItemRefDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDayDto)
  schedule: ScheduleDayDto[];
}
