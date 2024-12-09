import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TransactionStatus, UserRole } from '@common/contracts/constant'
import { Type } from 'class-transformer'
import { PaymentMethod, TransactionType } from '@src/transaction/contracts/constant'
import { Types } from 'mongoose'
import { MAX_PRICE, MIN_PRICE } from '@src/config'

class BaseTransactionAccountUserDto {
  @ApiProperty({ type: String })
  name?: Types.ObjectId
}
export class BaseTransactionAccountDto {
  @ApiProperty({ type: String })
  userId?: Types.ObjectId

  @ApiProperty({ type: String, enum: UserRole })
  userRole: UserRole

  @ApiPropertyOptional({ type: BaseTransactionAccountUserDto })
  user?: BaseTransactionAccountUserDto
}

export class BasePaymentDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: String })
  status: string

  @ApiPropertyOptional({ type: String })
  description?: string

  @ApiPropertyOptional({ type: String })
  orderInfo?: string

  // @ApiProperty({ type: BasePaymentDto, isArray: true })
  histories?: BasePaymentDto[]
}

export class BasePayoutDto {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: String })
  status: string

  // @ApiProperty({ type: BasePayoutDto, isArray: true })
  histories?: BasePayoutDto[]
}

export class BaseTransactionDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType

  @ApiPropertyOptional({ type: String, enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod

  @ApiProperty({ type: Number, example: 500_000 })
  @IsInt()
  @Min(MIN_PRICE)
  @Max(MAX_PRICE)
  amount: number

  @ApiProperty({ type: BaseTransactionAccountDto })
  @Type(() => BaseTransactionAccountDto)
  @ValidateNested()
  debitAccount: BaseTransactionAccountDto

  @ApiProperty({ type: BaseTransactionAccountDto })
  @Type(() => BaseTransactionAccountDto)
  @ValidateNested()
  creditAccount: BaseTransactionAccountDto

  @ApiProperty({ type: String, example: 'Transaction description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: String, enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus

  @ApiProperty({ type: BasePaymentDto })
  @IsOptional()
  @Type(() => BasePaymentDto)
  @ValidateNested()
  payment?: BasePaymentDto

  @ApiProperty({ type: BasePayoutDto })
  @IsOptional()
  @Type(() => BasePayoutDto)
  @ValidateNested()
  payout?: BasePayoutDto

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
