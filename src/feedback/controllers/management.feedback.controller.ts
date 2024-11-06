import { Controller, Get, UseGuards, Inject, Param, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IFeedbackService } from '@feedback/services/feedback.service'
import { ClassFeedbackListDataResponse, CourseFeedbackListDataResponse, QueryFeedbackDto } from '@feedback/dto/view-feedback.dto'
import { Types } from 'mongoose'
import { FEEDBACK_LIST_PROJECTION } from '@feedback/contracts/constant'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'

@ApiTags('Feedback - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementFeedbackController {
  constructor(
    @Inject(IFeedbackService)
    private readonly feedbackService: IFeedbackService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Course's Feedback List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CourseFeedbackListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('courses/:courseId([0-9a-f]{24})')
  async listCourseFeedback(
    @Param('courseId') courseId: string,
    @Pagination() pagination: PaginationParams,
    @Query() queryFeedbackDto: QueryFeedbackDto
  ) {
    queryFeedbackDto.courseId = new Types.ObjectId(courseId)
    return await this.feedbackService.list(pagination, queryFeedbackDto, FEEDBACK_LIST_PROJECTION, [
      {
        path: 'learner',
        select: ['_id', 'name', 'avatar']
      }
    ])
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class's Feedback List`
  })
  @ApiOkResponse({ type: ClassFeedbackListDataResponse })
  @Roles(UserRole.STAFF)
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
        select: ['_id', 'name', 'avatar']
      }
    ])
    return { docs: feedbacks }
  }
}
