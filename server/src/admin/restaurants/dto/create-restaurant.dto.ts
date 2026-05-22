import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsInt()
  @IsPositive()
  districtId: number;

  @IsInt()
  @IsPositive()
  restaurantCategoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsPets?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSpicyFood?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSingleSeating?: boolean;

  @IsBoolean()
  @IsOptional()
  hasTableSeating?: boolean;

  @IsBoolean()
  @IsOptional()
  hasFloorSeating?: boolean;

  @IsBoolean()
  @IsOptional()
  hasGroupSeating?: boolean;

  @IsBoolean()
  @IsOptional()
  hasPrivateRoom?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBarTable?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBabyChair?: boolean;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
