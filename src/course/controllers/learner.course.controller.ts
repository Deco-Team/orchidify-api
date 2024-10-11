import { Controller, Get, Inject, Query, Param, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { ClassStatus, CourseStatus, UserRole } from '@common/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { ICourseService } from '@course/services/course.service'
import {
  CourseDetailDataResponse,
  PublicCourseDetailDataResponse,
  PublicQueryCourseDto,
  PublishCourseListDataResponse
} from '@course/dto/view-course.dto'
import { PUBLIC_COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { PUBLIC_COURSE_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

@ApiTags('Course - Viewer/Learner')
@ApiBadRequestResponse({ type: ErrorResponse })
@Controller()
export class CourseController {
  constructor(
    @Inject(ICourseService)
    private readonly courseService: ICourseService
  ) {}

  @ApiOperation({
    summary: `[Viewer/Learner] View Course List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: PublishCourseListDataResponse })
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryCourseDto: PublicQueryCourseDto) {
    return await this.courseService.listPublicCourses(pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `[${UserRole.LEARNER}] View Course Detail`
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: PublicCourseDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  @Roles(UserRole.LEARNER)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') courseId: string) {
    const course = await this.courseService.findById(courseId, PUBLIC_COURSE_DETAIL_PROJECTION, [
      {
        path: 'classes',
        select: PUBLIC_COURSE_CLASS_DETAIL_PROJECTION,
        match: { status: ClassStatus.PUBLISHED },
        populate: {
          path: 'garden',
          select: ['_id', 'name']
        }
      },
      {
        path: 'instructor',
        select: PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION
      }
    ])
    if (
      !course ||
      course.isPublished === false ||
      [CourseStatus.ACTIVE, CourseStatus.REQUESTING].includes(course.status) === false
    )
      throw new AppException(Errors.COURSE_NOT_FOUND)
    return course
  }
}
