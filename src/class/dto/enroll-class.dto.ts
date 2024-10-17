import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaymentMethod } from '@src/transaction/contracts/constant'
import { IsEnum, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class EnrollClassDto {
  classId: Types.ObjectId
  paymentMethod: PaymentMethod = PaymentMethod.MOMO
  learnerId: Types.ObjectId

  @ApiPropertyOptional({ type: String, enum: ['captureWallet', 'payWithMethod'] })
  @IsOptional()
  @IsEnum(['captureWallet', 'payWithMethod'])
  requestType?: string
}
