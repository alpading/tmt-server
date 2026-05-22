import { IsOptional, IsString } from 'class-validator';

export class SearchActivityDto {
  @IsOptional()
  @IsString()
  basicFilters?: string;

  @IsOptional()
  @IsString()
  prefAttrIds?: string;
}
