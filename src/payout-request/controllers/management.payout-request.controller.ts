import { Controller, Get, UseGuards, Inject, Query, Param, Patch, Req, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery, SuccessDataResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IPayoutRequestService } from '@payout-request/services/payout-request.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import {
  QueryPayoutRequestDto,
  StaffViewPayoutRequestDetailDataResponse,
  StaffViewPayoutRequestListDataResponse
} from '@payout-request/dto/view-payout-request.dto'
import { PAYOUT_REQUEST_DETAIL_PROJECTION, PAYOUT_REQUEST_LIST_PROJECTION } from '@payout-request/contracts/constant'
import { RejectPayoutRequestDto } from '@payout-request/dto/reject-payout-request.dto'
import { MarkHasMadePayoutDto } from '@payout-request/dto/mark-has-made-payout.dto'

@ApiTags('PayoutRequest - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementPayoutRequestController {
  constructor(
    @Inject(IPayoutRequestService)
    private readonly payoutRequestService: IPayoutRequestService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Payout Request List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: StaffViewPayoutRequestListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryPayoutRequestDto: QueryPayoutRequestDto) {
    return await this.payoutRequestService.list(pagination, queryPayoutRequestDto, PAYOUT_REQUEST_LIST_PROJECTION, [
      {
        path: 'createdBy',
        select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar', 'paymentInfo']
      }
    ])
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Payout Request Detail`
  })
  @ApiOkResponse({ type: StaffViewPayoutRequestDetailDataResponse })
  @ApiErrorResponse([Errors.PAYOUT_REQUEST_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') payoutRequestId: string) {
    const payoutRequest = await this.payoutRequestService.findById(payoutRequestId, PAYOUT_REQUEST_DETAIL_PROJECTION, [
      {
        path: 'createdBy',
        select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar', 'paymentInfo']
      }
    ])

    if (!payoutRequest) throw new AppException(Errors.PAYOUT_REQUEST_NOT_FOUND)
    return payoutRequest
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Approve Payout Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.PAYOUT_REQUEST_NOT_FOUND,
    Errors.PAYOUT_REQUEST_STATUS_INVALID,
    Errors.PAYOUT_AMOUNT_LIMIT_PER_DAY
  ])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/approve')
  async approve(@Req() req, @Param('id') payoutRequestId: string) {
    const user = _.get(req, 'user')
    return this.payoutRequestService.approvePayoutRequest(payoutRequestId, user)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Reject Payout Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.PAYOUT_REQUEST_NOT_FOUND, Errors.PAYOUT_REQUEST_STATUS_INVALID])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/reject')
  async reject(
    @Req() req,
    @Param('id') payoutRequestId: string,
    @Body() rejectPayoutRequestDto: RejectPayoutRequestDto
  ) {
    const user = _.get(req, 'user')
    return this.payoutRequestService.rejectPayoutRequest(payoutRequestId, rejectPayoutRequestDto, user)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Mask Payout Request as Has made payout`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.PAYOUT_REQUEST_NOT_FOUND,
    Errors.PAYOUT_REQUEST_STATUS_INVALID,
    Errors.REQUEST_ALREADY_HAS_MADE_PAYOUT
  ])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/make-payout')
  async markAsHasMadePayout(
    @Req() req,
    @Param('id') payoutRequestId: string,
    @Body() markHasMadePayoutDto: MarkHasMadePayoutDto
  ) {
    const user = _.get(req, 'user')
    return this.payoutRequestService.markHasMadePayout(payoutRequestId, markHasMadePayoutDto, user)
  }
}
