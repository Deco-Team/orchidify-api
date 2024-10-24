import { Controller, Get, UseGuards, Inject, Query, Param, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IClassService } from '@class/services/class.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import {
  InstructorViewClassDetailDataResponse,
  InstructorViewClassListDataResponse,
  QueryClassDto
} from '@class/dto/view-class.dto'
import { CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { IAssignmentService } from '@class/services/assignment.service'
import { ViewAssignmentDetailDataResponse } from '@class/dto/view-assignment.dto'
import { ISessionService } from '@class/services/session.service'
import { ViewSessionDetailDataResponse } from '@class/dto/view-session.dto'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { Types } from 'mongoose'

@ApiTags('Class - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorClassController {
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
    summary: `View Class List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorViewClassListDataResponse })
  @Get()
  async list(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryClassDto: QueryClassDto) {
    const { _id } = _.get(req, 'user')
    return await this.classService.listByInstructor(_id, pagination, queryClassDto)
  }

  @ApiOperation({
    summary: `View Class Detail`
  })
  @ApiOkResponse({ type: InstructorViewClassDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') classId: string) {
    const { _id } = _.get(req, 'user')
    const [courseClass, learnerClass] = await Promise.all([
      this.classService.findById(classId, CLASS_DETAIL_PROJECTION, [
        {
          path: 'garden',
          select: ['name']
        },
        {
          path: 'course',
          select: ['code']
        }
      ]),
      this.learnerClassService.findMany({ classId: new Types.ObjectId(classId) }, undefined, [{ path: 'learner' }])
    ])
    if (!courseClass || courseClass.instructorId?.toString() !== _id) throw new AppException(Errors.CLASS_NOT_FOUND)

    return { ...courseClass.toJSON(), learners: learnerClass?.map((learnerClass) => learnerClass?.['learner']) }
  }

  @ApiOperation({
    summary: `View Session Detail`
  })
  @ApiOkResponse({ type: ViewSessionDetailDataResponse })
  @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
  @Get(':classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})')
  async getLessonDetail(@Req() req, @Param('classId') classId: string, @Param('sessionId') sessionId: string) {
    const { _id: instructorId } = _.get(req, 'user')
    const session = await this.sessionService.findOneBy({ sessionId, classId, instructorId })

    if (!session) throw new AppException(Errors.SESSION_NOT_FOUND)
    return session
  }

  @ApiOperation({
    summary: `View Assignment Detail`
  })
  @ApiOkResponse({ type: ViewAssignmentDetailDataResponse })
  @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  @Get(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  async getAssignmentDetail(
    @Req() req,
    @Param('classId') classId: string,
    @Param('assignmentId') assignmentId: string
  ) {
    const { _id: instructorId } = _.get(req, 'user')
    const assignment = await this.assignmentService.findOneBy({ assignmentId, classId, instructorId })

    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
    return assignment
  }
}
