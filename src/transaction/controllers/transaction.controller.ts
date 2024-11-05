import { Controller, Get, Inject, Logger, Param, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { TRANSACTION_DETAIL_PROJECTION } from '@src/transaction/contracts/constant'
import { ITransactionService } from '@transaction/services/transaction.service'
import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import {
  QueryTransactionDto,
  TransactionDetailDataResponse,
  TransactionListDataResponse
} from '@transaction/dto/view-transaction.dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { AppException } from '@common/exceptions/app.exception'
import { QueryStaffDto } from '@staff/dto/view-staff.dto'

@ApiTags('Transaction')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name)
  constructor(
    @Inject(ITransactionService)
    private readonly transactionService: ITransactionService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Transaction List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: TransactionListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryTransactionDto: QueryTransactionDto) {
    return await this.transactionService.list(pagination, queryTransactionDto)
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Transaction Detail`
  })
  @ApiOkResponse({ type: TransactionDetailDataResponse })
  @ApiErrorResponse([Errors.TRANSACTION_NOT_FOUND])
  @Roles(UserRole.ADMIN)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') staffId: string) {
    const transaction = await this.transactionService.findById(staffId, [...TRANSACTION_DETAIL_PROJECTION])

    if (!transaction) throw new AppException(Errors.TRANSACTION_NOT_FOUND)

    const payment = _.pick(transaction.payment, ['id', 'code', 'createdAt', 'status'])
    const payout = _.pick(transaction.payout, ['id', 'code', 'createdAt', 'status'])
    return { ...transaction.toObject(), payment, payout }
  }
}
