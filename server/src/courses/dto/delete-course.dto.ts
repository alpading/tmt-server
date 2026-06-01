import { IsInt, IsPositive } from 'class-validator';

export class DeleteCourseDto {
  @IsInt()
  @IsPositive()
  courseId: number;
}
