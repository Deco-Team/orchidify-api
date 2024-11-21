import { Controller, Get, UseGuards, Inject, Param, Req, Post, Body, Query } from '@nestjs/common'
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

import { ErrorResponse, PaginationQuery, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IFeedbackService } from '@feedback/services/feedback.service'
import {
  ClassFeedbackListDataResponse,
  CourseFeedbackListDataResponse,
  QueryFeedbackDto
} from '@feedback/dto/view-feedback.dto'
import { Types } from 'mongoose'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { FEEDBACK_LEANER_DETAIL, FEEDBACK_LIST_PROJECTION } from '@feedback/contracts/constant'
import { IClassService } from '@class/services/class.service'
import { SendFeedbackDto } from '@feedback/dto/send-feedback.dto'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'
import { SettingKey } from '@setting/contracts/constant'
import { ISettingService } from '@setting/services/setting.service'
import { Class } from '@class/schemas/class.schema'
import { Course } from '@course/schemas/course.schema'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'

@ApiTags('Feedback - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learner')
export class LearnerFeedbackController {
  constructor(
    @Inject(IFeedbackService)
    private readonly feedbackService: IFeedbackService,
    @Inject(IClassService)
    private readonly classService: IClassService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {}

  @ApiOperation({
    summary: `View Course's Feedback List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CourseFeedbackListDataResponse })
  @Get('courses/:courseId([0-9a-f]{24})')
  async list(
    @Param('courseId') courseId: string,
    @Pagination() pagination: PaginationParams,
    @Query() queryFeedbackDto: QueryFeedbackDto
  ) {
    queryFeedbackDto.courseId = new Types.ObjectId(courseId)
    return await this.feedbackService.list(pagination, queryFeedbackDto, FEEDBACK_LIST_PROJECTION, [
      {
        path: 'learner',
        select: FEEDBACK_LEANER_DETAIL
      }
    ])
  }

  @ApiOperation({
    summary: `View Class's Feedback List`
  })
  @ApiOkResponse({ type: ClassFeedbackListDataResponse })
  @Get('classes/:classId([0-9a-f]{24})')
  async listClassFeedback(@Param('classId') classId: string, @Query() queryFeedbackDto: QueryFeedbackDto) {
    const { rate } = queryFeedbackDto
    const conditions = {
      classId: new Types.ObjectId(classId)
    }
    if (rate) {
      conditions['rate'] = rate
    }

    const feedbacks = await this.feedbackService.findMany(conditions, FEEDBACK_LIST_PROJECTION, [
      {
        path: 'learner',
        select: FEEDBACK_LEANER_DETAIL
      }
    ])
    return { docs: feedbacks }
  }

  @ApiOperation({
    summary: `Send Feedback`
  })
  @ApiCreatedResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.FEEDBACK_SUBMITTED,
    Errors.CLASS_NOT_FOUND,
    Errors.NOT_ENROLL_CLASS_YET,
    Errors.FEEDBACK_NOT_OPEN_YET,
    Errors.FEEDBACK_IS_OVER
  ])
  @Post(':classId([0-9a-f]{24})')
  async sendFeedback(@Req() req, @Param('classId') classId: string, @Body() sendFeedbackDto: SendFeedbackDto) {
    const { _id: learnerId } = _.get(req, 'user')

    // check learner has sent feedback
    const feedback = await this.feedbackService.findOneBy({
      learnerId: new Types.ObjectId(learnerId),
      classId: new Types.ObjectId(classId)
    })
    if (feedback) throw new AppException(Errors.FEEDBACK_SUBMITTED)

    // check learner in class
    const learnerClass = await this.learnerClassService.findOneBy(
      {
        classId: new Types.ObjectId(classId),
        learnerId: new Types.ObjectId(learnerId)
      },
      ['_id', 'learnerId', 'classId'],
      [
        {
          path: 'class',
          select: ['startDate', 'duration', 'weekdays', 'slotNumbers', 'courseId', 'ratingSummary'],
          populate: [{ path: 'course', select: ['ratingSummary'] }]
        }
      ]
    )
    if (!learnerClass) throw new AppException(Errors.NOT_ENROLL_CLASS_YET)

    const courseClass = _.get(learnerClass, 'class') as Class
    if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)

    // BR-07: Feedback form opens on the last slot and no closes.
    const { startDate, duration, weekdays, slotNumbers } = courseClass
    const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays, slotNumbers })
    const now = moment().tz(VN_TIMEZONE)

    const sendFeedbackOpenTime = classEndTime.clone()
    if (now.isBefore(sendFeedbackOpenTime)) throw new AppException(Errors.FEEDBACK_NOT_OPEN_YET)

    // const sendFeedbackCloseTime = classEndTime.clone()
    // if (now.isAfter(sendFeedbackCloseTime)) throw new AppException(Errors.FEEDBACK_IS_OVER)

    sendFeedbackDto.learnerId = new Types.ObjectId(learnerId)
    sendFeedbackDto.classId = new Types.ObjectId(classId)
    sendFeedbackDto.courseId = new Types.ObjectId(courseClass.courseId)
    const course = _.get(courseClass, 'course') as Course

    await this.feedbackService.sendFeedback(
      sendFeedbackDto,
      _.get(courseClass, 'ratingSummary', null),
      _.get(course, 'ratingSummary', null)
    )
    return new SuccessResponse(true)
  }
}
