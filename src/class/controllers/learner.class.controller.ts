import { Controller, UseGuards, Inject, Param, Req, Post, Body } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
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
    private readonly assignmentService: IAssignmentService
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
}
