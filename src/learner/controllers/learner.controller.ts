import { Controller, Get, Req, UseGuards, Inject } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ILearnerService } from '@src/learner/services/learner.service'
import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { LearnerResponseDto } from '@src/learner/dto/learner.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'

@ApiTags('Learner')
@ApiBearerAuth()
@Roles(UserRole.LEARNER)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class LearnerController {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService
  ) {}

  // @ApiOperation({
  //   summary: 'Get learner information'
  // })
  // @Get('me')
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // @ApiOkResponse({ type: LearnerResponseDto })
  // async getOwnInformation(@Req() req) {
  //   const { _id } = _.get(req, 'user')
  //   const learner = await this.learnerService.findById(_id)

  //   if (!learner) throw new AppException(Errors.LEARNER_NOT_FOUND)
  //   return learner
  // }
}
