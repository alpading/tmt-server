import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

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
  offersWorkshop?: boolean;

  @IsBoolean()
  @IsOptional()
  isExhibition?: boolean;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
