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

import { ErrorResponse, IDDataResponse, IDResponse, PaginationQuery, SuccessDataResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { PayoutRequestStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IPayoutRequestService } from '@payout-request/services/payout-request.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { CreatePayoutRequestDto } from '@payout-request/dto/create-payout-request.dto'
import {
  InstructorViewPayoutRequestDetailDataResponse,
  InstructorViewPayoutRequestListDataResponse,
  QueryPayoutRequestDto,
  ViewPayoutUsageDataResponse
} from '@payout-request/dto/view-payout-request.dto'
import { PAYOUT_REQUEST_DETAIL_PROJECTION } from '@payout-request/contracts/constant'
import { Types } from 'mongoose'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'
import { IInstructorService } from '@instructor/services/instructor.service'

@ApiTags('PayoutRequest - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorPayoutRequestController {
  constructor(
    @Inject(IPayoutRequestService)
    private readonly payoutRequestService: IPayoutRequestService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService,
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService
  ) {}

  @ApiOperation({
    summary: `View Payout Request List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorViewPayoutRequestListDataResponse })
  @Get()
  async list(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryPayoutRequestDto: QueryPayoutRequestDto
  ) {
    const { _id } = _.get(req, 'user')
    queryPayoutRequestDto.createdBy = _id
    return await this.payoutRequestService.list(pagination, queryPayoutRequestDto)
  }

  @ApiOperation({
    summary: `View Payout Request Detail`
  })
  @ApiOkResponse({ type: InstructorViewPayoutRequestDetailDataResponse })
  @ApiErrorResponse([Errors.PAYOUT_REQUEST_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') payoutRequestId: string) {
    const { _id } = _.get(req, 'user')
    const payoutRequest = await this.payoutRequestService.findById(payoutRequestId, PAYOUT_REQUEST_DETAIL_PROJECTION)

    if (!payoutRequest || payoutRequest.createdBy?.toString() !== _id)
      throw new AppException(Errors.PAYOUT_REQUEST_NOT_FOUND)
    return payoutRequest
  }

  @ApiOperation({
    summary: `Create Payout Request`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([
    Errors.CREATE_PAYOUT_REQUEST_LIMIT,
    Errors.NOT_ENOUGH_BALANCE_TO_CREATE_PAYOUT_REQUEST,
    Errors.PAYOUT_AMOUNT_LIMIT_PER_DAY
  ])
  @Post()
  async createPayoutRequest(@Req() req, @Body() createPayoutRequestDto: CreatePayoutRequestDto) {
    const { _id, role } = _.get(req, 'user')

    const [payoutRequestsCount, payoutUsage] = await Promise.all([
      this.payoutRequestService.countByCreatedByAndDate(_id, new Date()),
      this.payoutRequestService.getPayoutUsage({ createdBy: _id, date: new Date() })
    ])

    const [createPayoutRequestLimitPerDay, payoutAmountLimitPerDay] = await Promise.all([
      this.settingService.findByKey(SettingKey.CreatePayoutRequestLimitPerDay),
      this.settingService.findByKey(SettingKey.PayoutAmountLimitPerDay)
    ])
    // BR-56: Instructors can create a maximum of 5 payout requests per day.
    const createPayoutRequestLimit = Number(createPayoutRequestLimitPerDay.value) || 5
    if (payoutRequestsCount >= createPayoutRequestLimit) throw new AppException(Errors.CREATE_PAYOUT_REQUEST_LIMIT)

    //BR-57: Daily maximum amount of payout requests is 50,000,000 VND.
    const payoutAmountLimit = Number(payoutAmountLimitPerDay.value) || 50_000_000
    if (payoutUsage + createPayoutRequestDto.amount > payoutAmountLimit)
      throw new AppException(Errors.PAYOUT_AMOUNT_LIMIT_PER_DAY)

    createPayoutRequestDto['status'] = PayoutRequestStatus.PENDING
    createPayoutRequestDto['histories'] = [
      {
        status: PayoutRequestStatus.PENDING,
        timestamp: new Date(),
        userId: new Types.ObjectId(_id),
        userRole: role
      }
    ]
    createPayoutRequestDto['createdBy'] = new Types.ObjectId(_id)

    // Create payout request with status PENDING
    const payoutRequest = await this.payoutRequestService.createPayoutRequest(createPayoutRequestDto)

    return new IDResponse(payoutRequest._id)
  }

  @ApiOperation({
    summary: `Cancel Payout Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.PAYOUT_REQUEST_NOT_FOUND, Errors.PAYOUT_REQUEST_STATUS_INVALID])
  @Patch(':id([0-9a-f]{24})/cancel')
  async cancel(@Req() req, @Param('id') payoutRequestId: string) {
    const user = _.get(req, 'user')
    return this.payoutRequestService.cancelPayoutRequest(payoutRequestId, user)
  }

  @ApiOperation({
    summary: `View Payout Usage, Balance, Payout Request count`
  })
  @ApiOkResponse({ type: ViewPayoutUsageDataResponse })
  @Get('usage')
  async getPayoutUsage(@Req() req) {
    const { _id } = _.get(req, 'user')

    const [instructor, usage, count] = await Promise.all([
      this.instructorService.findById(_id),
      this.payoutRequestService.getPayoutUsage({ createdBy: _id, date: new Date() }),
      this.payoutRequestService.countByCreatedByAndDate(_id, new Date())
    ])

    return {
      balance: instructor.balance,
      usage,
      count
    }
  }
}
