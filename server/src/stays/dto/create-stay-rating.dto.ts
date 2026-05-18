import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateStayRatingDto {
  @IsInt()
  @IsPositive()
  stayId: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  overallRating: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  interiorRating: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  cleanRating: number;

  @IsInt()
  @IsPositive()
  visitPartySize: number;

  @IsInt()
  @IsPositive()
  totalSpentAmount: number;
}
