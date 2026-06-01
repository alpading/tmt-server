import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateCourseNameDto {
  @IsInt()
  @IsPositive()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
