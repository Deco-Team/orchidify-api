import { Controller, Get, UseGuards, Inject, Query, Param, Req, Patch } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { ClassStatus, SlotNumber, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IClassService } from '@class/services/class.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import {
  GardenManagerViewClassDetailDataResponse,
  QueryClassDto,
  StaffViewClassDetailDataResponse,
  StaffViewClassListDataResponse
} from '@class/dto/view-class.dto'
import { CLASS_DETAIL_PROJECTION, GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { IAssignmentService } from '@class/services/assignment.service'
import { ViewAssignmentDetailDataResponse } from '@class/dto/view-assignment.dto'
import { ISessionService } from '@class/services/session.service'
import { ViewSessionDetailDataResponse } from '@class/dto/view-session.dto'
import { Types } from 'mongoose'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'

@ApiTags('Class - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementClassController {
  constructor(
    @Inject(IClassService)
    private readonly classService: IClassService,
    @Inject(ISessionService)
    private readonly sessionService: ISessionService,
    @Inject(IAssignmentService)
    private readonly assignmentService: IAssignmentService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: StaffViewClassListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryClassDto: QueryClassDto) {
    return await this.classService.listByStaff(pagination, queryClassDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class Detail`
  })
  @ApiOkResponse({ type: StaffViewClassDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') classId: string) {
    const [courseClass, learnerClass] = await Promise.all([
      this.classService.findById(classId, CLASS_DETAIL_PROJECTION, [
        {
          path: 'garden',
          select: ['name']
        },
        {
          path: 'instructor',
          select: ['name']
        },
        {
          path: 'course',
          select: ['code']
        }
      ]),
      this.learnerClassService.findMany({ classId: new Types.ObjectId(classId) }, undefined, [{ path: 'learner' }])
    ])

    if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)
    return { ...courseClass.toJSON(), learners: learnerClass?.map((learnerClass) => learnerClass?.['learner']) }
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Session Detail`
  })
  @ApiOkResponse({ type: ViewSessionDetailDataResponse })
  @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})')
  async getLessonDetail(@Param('classId') classId: string, @Param('sessionId') sessionId: string) {
    const session = await this.sessionService.findOneBy({ sessionId, classId })

    if (!session) throw new AppException(Errors.SESSION_NOT_FOUND)
    return session
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Assignment Detail`
  })
  @ApiOkResponse({ type: ViewAssignmentDetailDataResponse })
  @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  async getAssignmentDetail(@Param('classId') classId: string, @Param('assignmentId') assignmentId: string) {
    const assignment = await this.assignmentService.findOneBy({ assignmentId, classId })

    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
    return assignment
  }

  @ApiOperation({
    summary: `[${UserRole.GARDEN_MANAGER}] View Class Toolkit Requirements `
  })
  @ApiOkResponse({ type: GardenManagerViewClassDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
  @Roles(UserRole.GARDEN_MANAGER)
  @Get(':id([0-9a-f]{24})/gardenRequiredToolkits')
  async getClassToolkitRequirements(@Param('id') classId: string) {
    const courseClass = await this.classService.findById(classId, GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION, [
      {
        path: 'instructor',
        select: ['name']
      },
      {
        path: 'course',
        select: ['code']
      }
    ])
    if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)

    return courseClass
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Complete Class`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND, Errors.CLASS_STATUS_INVALID, Errors.CLASS_END_TIME_INVALID])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/complete')
  async completeClass(@Req() req, @Param('id') classId: string) {
    const courseClass = await this.classService.findById(classId, CLASS_DETAIL_PROJECTION)
    if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)

    // check valid status
    if (courseClass.status !== ClassStatus.IN_PROGRESS) throw new AppException(Errors.CLASS_STATUS_INVALID)

    // check valid classEndDate
    const { startDate, duration, weekdays, slotNumbers } = courseClass
    const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays, slotNumbers })
    if (moment().tz(VN_TIMEZONE).isBefore(classEndTime)) throw new AppException(Errors.CLASS_END_TIME_INVALID)

    const user = _.get(req, 'user')
    await this.classService.completeClass(classId, user)
    return new SuccessResponse(true)
  }
}
