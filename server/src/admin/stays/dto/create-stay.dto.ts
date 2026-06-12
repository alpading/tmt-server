import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateStayDto {
  @IsInt()
  @IsPositive()
  districtId: number;

  @IsInt()
  @IsPositive()
  stayCategoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBathtub?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBreakfast?: boolean;

  @IsBoolean()
  @IsOptional()
  hasTv?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBbq?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsCooking?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsPets?: boolean;

  @IsBoolean()
  @IsOptional()
  isWheelchairAccessible?: boolean;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  naverPlaceId?: string;
}
