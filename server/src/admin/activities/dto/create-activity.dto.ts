import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsInt()
  @IsPositive()
  destinationId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  availableParking?: boolean;

  @IsBoolean()
  @IsOptional()
  isWheelchairAccessible?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsPets?: boolean;

  @IsBoolean()
  @IsOptional()
  isKidFriendly?: boolean;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsBoolean()
  @IsOptional()
  isCafe?: boolean;

  @IsBoolean()
  @IsOptional()
  isShopping?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isExhibition?: boolean;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  naverPlaceId?: string;
}
