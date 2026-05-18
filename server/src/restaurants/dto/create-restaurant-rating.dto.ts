import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateRestaurantRatingDto {
  @IsInt()
  @IsPositive()
  restaurantId: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  overallRating: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  spaceRating: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  tasteRating: number;

  @IsInt()
  @IsPositive()
  visitPartySize: number;

  @IsInt()
  @IsPositive()
  totalSpentAmount: number;
}
