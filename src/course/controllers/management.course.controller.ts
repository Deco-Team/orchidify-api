import { Controller, Get, UseGuards, Inject, Query, Param } from '@nestjs/common'
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
import { ICourseSessionService } from '@course/services/course-session.service'
import { ICourseAssignmentService } from '@course/services/course-assignment.service'
import { CourseDetailDataResponse, CourseListDataResponse, StaffQueryCourseDto } from '@course/dto/view-course.dto'
import { COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { ViewCourseSessionDetailDataResponse } from '@course/dto/view-course-session.dto'
import { ViewCourseAssignmentDetailDataResponse } from '@course/dto/view-course-assignment.dto'
import { PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

@ApiTags('Course - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementCourseController {
  constructor(
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(ICourseSessionService)
    private readonly courseSessionService: ICourseSessionService,
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
    const course = await this.courseService.findById(courseId, COURSE_DETAIL_PROJECTION, [
      {
        path: 'instructor',
        select: PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION
      }
    ])
    if (
      !course ||
      course.isPublished === false ||
      [CourseStatus.ACTIVE].includes(course.status) === false
    )
      throw new AppException(Errors.COURSE_NOT_FOUND)
    return course
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Session Detail`
  })
  @ApiOkResponse({ type: ViewCourseSessionDetailDataResponse })
  @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':courseId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})')
  async getSessionDetail(@Param('courseId') courseId: string, @Param('sessionId') sessionId: string) {
    const session = await this.courseSessionService.findOneBy({ sessionId, courseId })

    if (!session) throw new AppException(Errors.SESSION_NOT_FOUND)
    return session
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
