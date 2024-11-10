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
import { CHILD_COURSE_COMBO_DETAIL_PROJECTION, COURSE_COMBO_DETAIL_PROJECTION } from '@course/contracts/constant'
import { COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import { ICourseComboService } from '@course/services/course-combo.service'
import {
  StaffQueryCourseComboDto,
  StaffViewCourseComboDetailDataResponse,
  StaffViewCourseComboListDataResponse
} from '@course/dto/view-course-combo.dto'

@ApiTags('CourseCombo - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementCourseComboController {
  constructor(
    @Inject(ICourseComboService)
    private readonly courseComboService: ICourseComboService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Combo List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: StaffViewCourseComboListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('combo')
  async list(@Pagination() pagination: PaginationParams, @Query() queryCourseDto: StaffQueryCourseComboDto) {
    return await this.courseComboService.listByStaff(pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course Combo Detail`
  })
  @ApiOkResponse({ type: StaffViewCourseComboDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_COMBO_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get('combo/:id([0-9a-f]{24})')
  async getDetail(@Param('id') courseId: string) {
    const courseCombo = await this.courseComboService.findById(courseId, COURSE_COMBO_DETAIL_PROJECTION, [
      {
        path: 'instructor',
        select: COURSE_INSTRUCTOR_DETAIL_PROJECTION
      },
      {
        path: 'childCourses',
        select: CHILD_COURSE_COMBO_DETAIL_PROJECTION
      }
    ])
    if (!courseCombo || [CourseStatus.ACTIVE].includes(courseCombo.status) === false)
      throw new AppException(Errors.COURSE_COMBO_NOT_FOUND)
    return courseCombo
  }
}
