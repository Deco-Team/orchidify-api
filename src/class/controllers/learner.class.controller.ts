import { Controller, UseGuards, Inject, Param, Req, Post, Body, Get, Query } from '@nestjs/common'
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

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IClassService } from '@class/services/class.service'
import { IAssignmentService } from '@class/services/assignment.service'
import { ISessionService } from '@class/services/session.service'
import { PaymentMethod } from '@src/transaction/contracts/constant'
import { Types } from 'mongoose'
import { CreateMomoPaymentDataResponse } from '@src/transaction/dto/momo-payment.dto'
import { EnrollClassDto } from '@class/dto/enroll-class.dto'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { AppException } from '@common/exceptions/app.exception'
import {
  LearnerViewMyClassDetailDataResponse,
  LearnerViewMyClassListDataResponse,
  QueryClassDto
} from '@class/dto/view-class.dto'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

@ApiTags('Class - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learner')
export class LearnerClassController {
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
    summary: `Enroll Class`
  })
  @ApiCreatedResponse({ type: CreateMomoPaymentDataResponse })
  @ApiErrorResponse([
    Errors.UNVERIFIED_ACCOUNT,
    Errors.INACTIVE_ACCOUNT,
    Errors.CLASS_NOT_FOUND,
    Errors.CLASS_STATUS_INVALID,
    Errors.CLASS_LEARNER_LIMIT,
    Errors.LEARNER_CLASS_EXISTED
  ])
  @Post('enroll/:id([0-9a-f]{24})')
  async enrollClass(@Req() req, @Param('id') classId: string, @Body() enrollClassDto: EnrollClassDto) {
    const { _id } = _.get(req, 'user')

    // TODO: validate timesheet of learner before enroll

    const createMomoPaymentResponse = await this.classService.enrollClass({
      classId: new Types.ObjectId(classId),
      paymentMethod: PaymentMethod.MOMO,
      learnerId: _id,
      requestType: enrollClassDto.requestType
    })
    return createMomoPaymentResponse
  }

  @ApiOperation({
    summary: `View My Class List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerViewMyClassListDataResponse })
  @Get('my-classes')
  async myClassList(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryClassDto: QueryClassDto) {
    const { _id } = _.get(req, 'user')
    return await this.learnerClassService.listMyClassesByLearner(_id, pagination, queryClassDto)
  }

  @ApiOperation({
    summary: `View My Class Detail`
  })
  @ApiOkResponse({ type: LearnerViewMyClassDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
  @Get('my-classes/:id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') classId: string) {
    const { _id } = _.get(req, 'user')
    const learnerClass = await this.learnerClassService.findOneBy(
      { learnerId: new Types.ObjectId(_id), classId: new Types.ObjectId(classId) },
      undefined,
      [
        {
          path: 'class',
          select: LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION,
          populate: [
            {
              path: 'garden',
              select: ['name']
            },
            {
              path: 'instructor',
              select: MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION
            }
          ]
        }
      ]
    )
    if (!learnerClass) throw new AppException(Errors.CLASS_NOT_FOUND)

    return learnerClass?.['class']
  }

  // @ApiOperation({
  //   summary: `View My Session Detail`
  // })
  // @ApiOkResponse({ type: ViewSessionDetailDataResponse })
  // @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
  // @Get('my-classes/:classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})')
  // async getLessonDetail(@Req() req, @Param('classId') classId: string, @Param('sessionId') sessionId: string) {
  //   const { _id: instructorId } = _.get(req, 'user')
  //   const session = await this.sessionService.findOneBy({ sessionId, classId, instructorId })

  //   if (!session) throw new AppException(Errors.SESSION_NOT_FOUND)
  //   return session
  // }

  // @ApiOperation({
  //   summary: `View My Assignment Detail`
  // })
  // @ApiOkResponse({ type: ViewAssignmentDetailDataResponse })
  // @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  // @Get('my-classes/:classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  // async getAssignmentDetail(
  //   @Req() req,
  //   @Param('classId') classId: string,
  //   @Param('assignmentId') assignmentId: string
  // ) {
  //   const { _id: instructorId } = _.get(req, 'user')
  //   const assignment = await this.assignmentService.findOneBy({ assignmentId, classId, instructorId })

  //   if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
  //   return assignment
  // }
}
