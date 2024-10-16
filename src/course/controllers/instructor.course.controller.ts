import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Req, Delete } from '@nestjs/common'
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
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { Types } from 'mongoose'
import { ICourseService } from '@course/services/course.service'
import { ICourseSessionService } from '@course/services/course-session.service'
import { ICourseAssignmentService } from '@course/services/course-assignment.service'
import { CourseDetailDataResponse, CourseListDataResponse, QueryCourseDto } from '@course/dto/view-course.dto'
import { COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { ViewCourseSessionDetailDataResponse } from '@course/dto/view-course-session.dto'
import { CreateCourseDto } from '@course/dto/create-course.dto'
import { UpdateCourseDto } from '@course/dto/update-course.dto'
import { ViewCourseAssignmentDetailDataResponse } from '@course/dto/view-course-assignment.dto'
import { session } from 'passport'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'

@ApiTags('Course - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorCourseController {
  constructor(
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(ICourseSessionService)
    private readonly courseSessionService: ICourseSessionService,
    @Inject(ICourseAssignmentService)
    private readonly courseAssignmentService: ICourseAssignmentService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {}

  @ApiOperation({
    summary: `View Course List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CourseListDataResponse })
  @Get()
  async list(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryCourseDto: QueryCourseDto) {
    const { _id } = _.get(req, 'user')
    return await this.courseService.listByInstructor(_id, pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `View Course Detail`
  })
  @ApiOkResponse({ type: CourseDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') courseId: string) {
    const { _id } = _.get(req, 'user')
    const course = await this.courseService.findById(courseId, COURSE_DETAIL_PROJECTION)

    if (!course || course.instructorId?.toString() !== _id) throw new AppException(Errors.COURSE_NOT_FOUND)
    return course
  }

  @ApiOperation({
    summary: `View Course Session Detail`
  })
  @ApiOkResponse({ type: ViewCourseSessionDetailDataResponse })
  @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
  @Get(':courseId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})')
  async getSessionDetail(@Req() req, @Param('courseId') courseId: string, @Param('sessionId') sessionId: string) {
    const { _id: instructorId } = _.get(req, 'user')
    const session = await this.courseSessionService.findOneBy({ sessionId, courseId, instructorId })

    if (!session) throw new AppException(Errors.SESSION_NOT_FOUND)
    return session
  }

  @ApiOperation({
    summary: `View Course Assignment Detail`
  })
  @ApiOkResponse({ type: ViewCourseAssignmentDetailDataResponse })
  @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  @Get(':courseId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  async getAssignmentDetail(
    @Req() req,
    @Param('courseId') courseId: string,
    @Param('assignmentId') assignmentId: string
  ) {
    const { _id: instructorId } = _.get(req, 'user')
    const assignment = await this.courseAssignmentService.findOneBy({ assignmentId, courseId, instructorId })

    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
    return assignment
  }

  @ApiOperation({
    summary: `Create Course`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @Post()
  async create(@Req() req, @Body() createCourseDto: CreateCourseDto) {
    // validate sessionsCount = 2 * duration
    if (createCourseDto.sessions.length !== 2 * createCourseDto.duration) {
      throw new AppException(Errors.TOTAL_SESSIONS_OF_COURSE_INVALID)
    }
    // validate assignments from 1 to 3
    const [assignmentsCountMin, assignmentsCountMax] = Array(
      (await this.settingService.findByKey(SettingKey.AssignmentsCountRange)).value
    ) || [1, 3]
    const assignmentsCount = createCourseDto.sessions.filter((session) => session.assignments.length === 1).length
    if (assignmentsCount < Number(assignmentsCountMin) || assignmentsCount > Number(assignmentsCountMax)) {
      throw new AppException(Errors.TOTAL_ASSIGNMENTS_OF_COURSE_INVALID)
    }

    const { _id } = _.get(req, 'user')
    createCourseDto['status'] = CourseStatus.DRAFT
    createCourseDto['instructorId'] = new Types.ObjectId(_id)
    createCourseDto.sessions = createCourseDto.sessions.map((session, index) => {
      return { ...session, sessionNumber: index + 1 }
    })
    const course = await this.courseService.create(createCourseDto)
    return new IDResponse(course._id)
  }

  @ApiOperation({
    summary: `Update Course at status: [${CourseStatus.DRAFT}]`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND, Errors.CAN_NOT_UPDATE_COURSE])
  @Put(':id([0-9a-f]{24})')
  async update(@Req() req, @Param('id') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    const { _id } = _.get(req, 'user')
    const course = await this.courseService.findById(courseId)

    if (!course || course.instructorId?.toString() !== _id || course.status === CourseStatus.DELETED)
      throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status !== CourseStatus.DRAFT) throw new AppException(Errors.CAN_NOT_UPDATE_COURSE)

    await this.courseService.update(
      {
        _id: courseId
      },
      updateCourseDto
    )
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `Delete Course at status [${CourseStatus.DRAFT}]`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND, Errors.CAN_NOT_DELETE_COURSE])
  @Delete(':id([0-9a-f]{24})')
  async delete(@Req() req, @Param('id') courseId: string) {
    const { _id } = _.get(req, 'user')
    const course = await this.courseService.findById(courseId)

    if (!course || course.instructorId?.toString() !== _id || course.status === CourseStatus.DELETED)
      throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status !== CourseStatus.DRAFT) throw new AppException(Errors.CAN_NOT_DELETE_COURSE)

    await this.courseService.update({ _id: courseId }, { status: CourseStatus.DELETED })

    return new SuccessResponse(true)
  }
}
