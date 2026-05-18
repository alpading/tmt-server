import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateActivityRatingDto {
  @IsInt()
  @IsPositive()
  activityId: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  overallRating: number;
}
