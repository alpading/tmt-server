import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePreferenceDto {
  @IsInt() @Min(1) @Max(3) @IsOptional() resOily?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resMild?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resClean?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resStim?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resSpicy?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resNoise?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resInterior?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() resService?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() stayView?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() stayInterior?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() staySpace?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() stayNoise?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() stayClean?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() stayService?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() actCulture?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() actView?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() actHealing?: number;
  @IsInt() @Min(1) @Max(3) @IsOptional() actActive?: number;
}
