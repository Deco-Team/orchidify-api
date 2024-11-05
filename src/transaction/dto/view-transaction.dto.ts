import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseTransactionDto } from './base.transaction.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { TransactionStatus } from '@common/contracts/constant'
import { Transform, Type } from 'class-transformer'
import { PaymentMethod, TRANSACTION_DETAIL_PROJECTION, TRANSACTION_LIST_PROJECTION, TransactionType } from '@transaction/contracts/constant'

export class QueryTransactionDto {
  @ApiPropertyOptional({
    enum: TransactionType,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  type: TransactionType[]

  @ApiPropertyOptional({
    enum: [PaymentMethod.STRIPE, PaymentMethod.MOMO],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  paymentMethod: PaymentMethod[]

  @ApiPropertyOptional({
    enum: [TransactionStatus.CAPTURED, TransactionStatus.ERROR, TransactionStatus.CANCELED],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: TransactionStatus[]

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1_000)
  @Max(50_000_000)
  fromAmount: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1_000)
  @Max(50_000_000)
  toAmount: number
}

class TransactionListItemResponse extends PickType(BaseTransactionDto, TRANSACTION_LIST_PROJECTION) {}
class TransactionListResponse extends PaginateResponse(TransactionListItemResponse) {}
export class TransactionListDataResponse extends DataResponse(TransactionListResponse) {}

class TransactionDetailResponse extends PickType(BaseTransactionDto, TRANSACTION_DETAIL_PROJECTION) {}
export class TransactionDetailDataResponse extends DataResponse(TransactionDetailResponse) {}
