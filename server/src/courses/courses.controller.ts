import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, RequestUser } from '../common/decorators/get-user.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseNameDto } from './dto/update-course-name.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';

@Controller('me/course')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post()
  @HttpCode(201)
  createCourse(@GetUser() user: RequestUser, @Body() dto: CreateCourseDto) {
    return this.service.createCourse(user.id, dto);
  }

  @Get('list')
  getCourseList(@GetUser() user: RequestUser) {
    return this.service.getCourseList(user.id);
  }

  @Get(':courseId')
  getCourse(@GetUser() user: RequestUser, @Param('courseId', ParseIntPipe) courseId: number) {
    return this.service.getCourse(user.id, courseId);
  }

  @Patch('name')
  updateCourseName(@GetUser() user: RequestUser, @Body() dto: UpdateCourseNameDto) {
    return this.service.updateCourseName(user.id, dto);
  }

  @Delete()
  @HttpCode(200)
  deleteCourse(@GetUser() user: RequestUser, @Body() dto: DeleteCourseDto) {
    return this.service.deleteCourse(user.id, dto);
  }
}
