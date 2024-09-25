import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Patch } from '@nestjs/common'
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
import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IUserTokenService } from '@auth/services/user-token.service'
import { Types } from 'mongoose'
import { ILearnerService } from '@learner/services/learner.service'
import { LearnerDetailDataResponse, LearnerListDataResponse, QueryLearnerDto } from '@learner/dto/view-learner.dto'
import { LEARNER_DETAIL_PROJECTION } from '@learner/contracts/constant'

@ApiTags('Learner - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementLearnerController {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Learner List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryLearnerDto: QueryLearnerDto) {
    return await this.learnerService.list(pagination, queryLearnerDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Learner Detail`
  })
  @ApiOkResponse({ type: LearnerDetailDataResponse })
  @ApiErrorResponse([Errors.LEARNER_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') learnerId: string) {
    const learner = await this.learnerService.findById(learnerId, LEARNER_DETAIL_PROJECTION)
    if (!learner) throw new AppException(Errors.LEARNER_NOT_FOUND)

    return learner
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Deactivate Learner`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') learnerId: string) {
    await Promise.all([
      this.learnerService.update(
        {
          _id: learnerId
        },
        { status: LearnerStatus.INACTIVE }
      ),
      this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(learnerId), UserRole.LEARNER)
    ])
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Activate Learner`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') learnerId: string) {
    await this.learnerService.update(
      {
        _id: learnerId
      },
      { status: LearnerStatus.ACTIVE }
    )
    return new SuccessResponse(true)
  }
}
