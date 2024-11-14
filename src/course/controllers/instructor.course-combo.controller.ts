import { Controller, UseGuards, Inject, Put, Body, Post, Param, Req, Delete, Get, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse,
  IDDataResponse,
  IDResponse,
  PaginationQuery,
  SuccessDataResponse,
  SuccessResponse
} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { CourseStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Types } from 'mongoose'
import { ICourseService } from '@course/services/course.service'
import { CreateCourseComboDto } from '@course/dto/create-course-combo.dto'
import { UpdateCourseComboDto } from '@course/dto/update-course-combo.dto'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { ICourseComboService } from '@course/services/course-combo.service'
import {
  CourseComboDetailDataResponse,
  CourseComboListDataResponse,
  QueryCourseComboDto
} from '@course/dto/view-course-combo.dto'
import { CHILD_COURSE_COMBO_DETAIL_PROJECTION, COURSE_COMBO_DETAIL_PROJECTION } from '@course/contracts/constant'

@ApiTags('CourseCombo - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorCourseComboController {
  constructor(
    @Inject(ICourseComboService)
    private readonly courseComboService: ICourseComboService,
    @Inject(ICourseService)
    private readonly courseService: ICourseService
  ) {}

  @ApiOperation({
    summary: `View Course Combo List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CourseComboListDataResponse })
  @Get('combo')
  async list(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryCourseDto: QueryCourseComboDto) {
    const { _id } = _.get(req, 'user')
    return await this.courseComboService.listByInstructor(_id, pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `View Course Combo Detail`
  })
  @ApiOkResponse({ type: CourseComboDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_COMBO_NOT_FOUND])
  @Get('combo/:id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') courseId: string) {
    const { _id } = _.get(req, 'user')
    const courseCombo = await this.courseComboService.findById(courseId, COURSE_COMBO_DETAIL_PROJECTION, [
      {
        path: 'childCourses',
        select: CHILD_COURSE_COMBO_DETAIL_PROJECTION
      }
    ])

    if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === CourseStatus.DELETED)
      throw new AppException(Errors.COURSE_COMBO_NOT_FOUND)
    return courseCombo
  }

  @ApiOperation({
    summary: `Create Course Combo`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([Errors.CHILD_COURSE_COMBO_INVALID, Errors.COURSE_COMBO_EXISTED])
  @Post('combo')
  async create(@Req() req, @Body() createCourseComboDto: CreateCourseComboDto) {
    const { _id } = _.get(req, 'user')
    const { childCourseIds } = createCourseComboDto

    // Validate child courses
    const childCourses = await this.courseService.findMany({
      _id: {
        $in: childCourseIds.map((courseId) => new Types.ObjectId(courseId))
      },
      instructorId: new Types.ObjectId(_id),
      status: CourseStatus.ACTIVE,
      childCourseIds: { $exists: false }
    })
    if (childCourses.length !== childCourseIds.length) throw new AppException(Errors.CHILD_COURSE_COMBO_INVALID)

    // check if course combo with childCourseIds has been created
    const existedCourseCombos = await this.courseComboService.findMany({
      instructorId: new Types.ObjectId(_id),
      status: CourseStatus.ACTIVE,
      childCourseIds: {
        $exists: true,
        $size: childCourseIds.length,
        $all: childCourseIds.map((courseId) => new Types.ObjectId(courseId))
      }
    })
    if (existedCourseCombos.length > 0) throw new AppException(Errors.COURSE_COMBO_EXISTED)

    createCourseComboDto['status'] = CourseStatus.ACTIVE
    createCourseComboDto['instructorId'] = new Types.ObjectId(_id)
    createCourseComboDto['childCourseIds'] = childCourseIds.map((courseId) => new Types.ObjectId(courseId))
    const course = await this.courseComboService.create(createCourseComboDto)
    return new IDResponse(course._id)
  }

  @ApiOperation({
    summary: `Update Course Combo`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_COMBO_NOT_FOUND, Errors.CHILD_COURSE_COMBO_INVALID, Errors.COURSE_COMBO_EXISTED])
  @Put('combo/:id([0-9a-f]{24})')
  async update(@Req() req, @Param('id') courseId: string, @Body() updateCourseComboDto: UpdateCourseComboDto) {
    const { _id } = _.get(req, 'user')
    const { childCourseIds } = updateCourseComboDto

    const courseCombo = await this.courseComboService.findById(courseId)
    if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === CourseStatus.DELETED)
      throw new AppException(Errors.COURSE_COMBO_NOT_FOUND)
    // if (course.status !== CourseStatus.DRAFT || course.isRequesting === true)
    //   throw new AppException(Errors.CAN_NOT_UPDATE_COURSE)

    // Validate child courses
    const childCourses = await this.courseService.findMany({
      _id: {
        $in: childCourseIds.map((courseId) => new Types.ObjectId(courseId))
      },
      instructorId: new Types.ObjectId(_id),
      status: CourseStatus.ACTIVE,
      childCourseIds: { $exists: false }
    })
    if (childCourses.length !== childCourseIds.length) throw new AppException(Errors.CHILD_COURSE_COMBO_INVALID)

    // check if course combo with childCourseIds has been created
    const existedCourseCombos = await this.courseComboService.findMany({
      _id: { $ne: courseCombo._id },
      instructorId: new Types.ObjectId(_id),
      status: CourseStatus.ACTIVE,
      childCourseIds: {
        $all: childCourseIds.map((courseId) => new Types.ObjectId(courseId)),
        $size: childCourseIds.length
      }
    })
    if (existedCourseCombos.length > 0) throw new AppException(Errors.COURSE_COMBO_EXISTED)

    await this.courseComboService.update(
      {
        _id: courseId
      },
      updateCourseComboDto
    )
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `Delete Course Combo`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_COMBO_NOT_FOUND])
  @Delete('combo/:id([0-9a-f]{24})')
  async delete(@Req() req, @Param('id') courseId: string) {
    const { _id } = _.get(req, 'user')
    const courseCombo = await this.courseComboService.findById(courseId)

    if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === CourseStatus.DELETED)
      throw new AppException(Errors.COURSE_COMBO_NOT_FOUND)
    // if (course.status !== CourseStatus.DRAFT || course.isRequesting === true)
    //   throw new AppException(Errors.CAN_NOT_DELETE_COURSE)

    await this.courseComboService.update({ _id: courseId }, { status: CourseStatus.DELETED })

    return new SuccessResponse(true)
  }
}
