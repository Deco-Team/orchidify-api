import { Controller, Get, UseGuards, Inject, Body, Post, Query, Param, Req, Patch } from '@nestjs/common'
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
import { ClassRequestStatus, ClassRequestType, CourseStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IClassRequestService } from '@class-request/services/class-request.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { CreatePublishClassRequestDto } from '@class-request/dto/create-publish-class-request.dto'
import {
  InstructorViewClassRequestDetailDataResponse,
  InstructorViewClassRequestListDataResponse,
  QueryClassRequestDto
} from '@class-request/dto/view-class-request.dto'
import { CLASS_REQUEST_DETAIL_PROJECTION } from '@class-request/contracts/constant'
import { Types } from 'mongoose'
import { ICourseService } from '@course/services/course.service'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { HelperService } from '@common/services/helper.service'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'

@ApiTags('ClassRequest - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorClassRequestController {
  constructor(
    @Inject(IClassRequestService)
    private readonly classRequestService: IClassRequestService,
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService,
    private readonly helperService: HelperService
  ) {}

  @ApiOperation({
    summary: `View Class Request List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorViewClassRequestListDataResponse })
  @Get()
  async list(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryClassRequestDto: QueryClassRequestDto
  ) {
    const { _id } = _.get(req, 'user')
    queryClassRequestDto.createdBy = _id
    return await this.classRequestService.list(pagination, queryClassRequestDto)
  }

  @ApiOperation({
    summary: `View Class Request Detail`
  })
  @ApiOkResponse({ type: InstructorViewClassRequestDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_REQUEST_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') classRequestId: string) {
    const { _id } = _.get(req, 'user')
    const classRequest = await this.classRequestService.findById(classRequestId, CLASS_REQUEST_DETAIL_PROJECTION)

    if (!classRequest || classRequest.createdBy?.toString() !== _id)
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    return classRequest
  }

  @ApiOperation({
    summary: `Create Publish Class Request`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([
    Errors.COURSE_NOT_FOUND,
    Errors.COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS,
    Errors.CREATE_CLASS_REQUEST_LIMIT,
    Errors.CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID,
    Errors.WEEKDAYS_OF_CLASS_INVALID
  ])
  @Post('publish-class')
  async createPublishClassRequest(@Req() req, @Body() createPublishClassRequestDto: CreatePublishClassRequestDto) {
    const { _id, role } = _.get(req, 'user')
    const { startDate, weekdays, slotNumbers } = createPublishClassRequestDto

    const isValidWeekdays = this.helperService.validateWeekdays(weekdays)
    if (!isValidWeekdays) throw new AppException(Errors.WEEKDAYS_OF_CLASS_INVALID)

    // BR-39: Instructors can only create 10 class requests per day.
    const createClassRequestLimit =
      Number((await this.settingService.findByKey(SettingKey.CreateClassRequestLimitPerDay)).value) || 10
    const classRequestsCount = await this.classRequestService.countByCreatedByAndDate(_id, new Date())
    if (classRequestsCount > createClassRequestLimit) throw new AppException(Errors.CREATE_CLASS_REQUEST_LIMIT)

    const course = await this.courseService.findById(createPublishClassRequestDto.courseId.toString(), ['+sessions'])
    if (!course || course.status === CourseStatus.DELETED || course.instructorId.toString() !== _id)
      throw new AppException(Errors.COURSE_NOT_FOUND)

    // BR-40: When a request for a class has been made, if that request has not been approved by staff, a new request for that class cannot be created.
    const pendingClassRequests = await this.classRequestService.findMany({
      courseId: course._id,
      status: ClassRequestStatus.PENDING
    })
    if (pendingClassRequests.length > 0) throw new AppException(Errors.COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS)

    // validate slots with startDate, weekdays
    const { duration } = course
    const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
      startDate,
      duration,
      weekdays,
      instructorId: _id
    })
    if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0)
      throw new AppException(Errors.CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID)

    createPublishClassRequestDto['status'] = ClassRequestStatus.PENDING
    createPublishClassRequestDto['histories'] = [
      {
        status: ClassRequestStatus.PENDING,
        timestamp: new Date(),
        userId: new Types.ObjectId(_id),
        userRole: role
      }
    ]
    createPublishClassRequestDto['createdBy'] = new Types.ObjectId(_id)
    createPublishClassRequestDto['courseId'] = new Types.ObjectId(createPublishClassRequestDto.courseId)
    createPublishClassRequestDto['type'] = ClassRequestType.PUBLISH_CLASS
    createPublishClassRequestDto['metadata'] = {
      weekdays,
      slotNumbers,
      startDate,
      ...course.toObject()
    }

    // Create class request with status PENDING
    const classRequest = await this.classRequestService.createPublishClassRequest(createPublishClassRequestDto)

    return new IDResponse(classRequest._id)
  }

  @ApiOperation({
    summary: `Cancel Publish Class Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.CLASS_REQUEST_NOT_FOUND,
    Errors.CLASS_REQUEST_STATUS_INVALID,
    Errors.COURSE_NOT_FOUND,
    Errors.COURSE_STATUS_INVALID
  ])
  @Patch(':id([0-9a-f]{24})/cancel')
  async cancel(@Req() req, @Param('id') classRequestId: string) {
    const user = _.get(req, 'user')
    return this.classRequestService.cancelPublishClassRequest(classRequestId, user)
  }
}
