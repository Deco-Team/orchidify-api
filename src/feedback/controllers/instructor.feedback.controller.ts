import { Controller, Get, UseGuards, Inject, Param, Query, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IFeedbackService } from '@feedback/services/feedback.service'
import {
  InstructorViewClassFeedbackListDataResponse,
  InstructorViewCourseFeedbackListDataResponse,
  QueryFeedbackDto
} from '@feedback/dto/view-feedback.dto'
import { Types } from 'mongoose'
import { INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION } from '@feedback/contracts/constant'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Errors } from '@common/contracts/error'
import { ICourseService } from '@course/services/course.service'
import { AppException } from '@common/exceptions/app.exception'
import { IClassService } from '@class/services/class.service'

@ApiTags('Feedback - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorFeedbackController {
  constructor(
    @Inject(IFeedbackService)
    private readonly feedbackService: IFeedbackService,
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(IClassService)
    private readonly classService: IClassService
  ) {}

  @ApiOperation({
    summary: `View Course's Feedback List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorViewCourseFeedbackListDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  @Get('courses/:courseId([0-9a-f]{24})')
  async listCourseFeedback(
    @Req() req,
    @Param('courseId') courseId: string,
    @Pagination() pagination: PaginationParams,
    @Query() queryFeedbackDto: QueryFeedbackDto
  ) {
    const { _id } = _.get(req, 'user')
    const course = await this.courseService.findById(courseId)
    if (!course || course.instructorId?.toString() !== _id) throw new AppException(Errors.COURSE_NOT_FOUND)

    queryFeedbackDto.courseId = new Types.ObjectId(courseId)
    return await this.feedbackService.list(pagination, queryFeedbackDto, INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION)
  }

  @ApiOperation({
    summary: `View Class's Feedback List`
  })
  @ApiOkResponse({ type: InstructorViewClassFeedbackListDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
  @Get('classes/:classId([0-9a-f]{24})')
  async listClassFeedback(@Req() req, @Param('classId') classId: string, @Query() queryFeedbackDto: QueryFeedbackDto) {
    const { _id } = _.get(req, 'user')
    const courseClass = await this.classService.findById(classId)
    if (!courseClass || courseClass.instructorId?.toString() !== _id) throw new AppException(Errors.CLASS_NOT_FOUND)

    const { rate } = queryFeedbackDto
    const conditions = {
      classId: new Types.ObjectId(classId)
    }
    if (rate) {
      conditions['rate'] = rate
    }

    const feedbacks = await this.feedbackService.findMany(conditions, INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION)
    return { docs: feedbacks }
  }
}
