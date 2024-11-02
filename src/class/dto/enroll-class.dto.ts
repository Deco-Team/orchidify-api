import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaymentMethod } from '@src/transaction/contracts/constant'
import { IsEnum, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class EnrollClassDto {
  classId: Types.ObjectId
  learnerId: Types.ObjectId

  @ApiPropertyOptional({ type: String, enum: PaymentMethod, example: PaymentMethod.STRIPE })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.STRIPE

  // @ApiPropertyOptional({ type: String, enum: ['captureWallet', 'payWithMethod'] })
  @IsOptional()
  @IsEnum(['captureWallet', 'payWithMethod'])
  requestType?: string
}
