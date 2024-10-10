import { Controller, Get, UseGuards, Inject, Query, Param, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { CourseStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { ICourseService } from '@course/services/course.service'
import { ICourseLessonService } from '@course/services/course-lesson.service'
import { ICourseAssignmentService } from '@course/services/course-assignment.service'
import {
  CourseDetailDataResponse,
  CourseListDataResponse,
  PublicQueryCourseDto,
  StaffQueryCourseDto
} from '@course/dto/view-course.dto'
import { COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { ViewCourseLessonDetailDataResponse } from '@course/dto/view-course-lesson.dto'
import { ViewCourseAssignmentDetailDataResponse } from '@course/dto/view-course-assignment.dto'

@ApiTags('Course - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementCourseController {
  constructor(
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(ICourseLessonService)
    private readonly courseLessonService: ICourseLessonService,
    @Inject(ICourseAssignmentService)
    private readonly courseAssignmentService: ICourseAssignmentService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CourseListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryCourseDto: StaffQueryCourseDto) {
    return await this.courseService.listByStaff(pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Detail`
  })
  @ApiOkResponse({ type: CourseDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') courseId: string) {
    const course = await this.courseService.findById(courseId, COURSE_DETAIL_PROJECTION)
    if (
      !course ||
      course.isPublished === false ||
      [CourseStatus.ACTIVE, CourseStatus.REQUESTING].includes(course.status) === false
    )
      throw new AppException(Errors.COURSE_NOT_FOUND)
    return course
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Lesson Detail`
  })
  @ApiOkResponse({ type: ViewCourseLessonDetailDataResponse })
  @ApiErrorResponse([Errors.LESSON_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':courseId([0-9a-f]{24})/lessons/:lessonId([0-9a-f]{24})')
  async getLessonDetail(@Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
    const lesson = await this.courseLessonService.findOneBy({ lessonId, courseId })

    if (!lesson) throw new AppException(Errors.LESSON_NOT_FOUND)
    return lesson
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Assignment Detail`
  })
  @ApiOkResponse({ type: ViewCourseAssignmentDetailDataResponse })
  @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':courseId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  async getAssignmentDetail(@Param('courseId') courseId: string, @Param('assignmentId') assignmentId: string) {
    const assignment = await this.courseAssignmentService.findOneBy({ assignmentId, courseId })

    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
    return assignment
  }
}
