import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchRestaurantDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @IsString()
  basicFilters?: string;

  @IsOptional()
  @IsString()
  prefAttrIds?: string;
}
