import { PickType } from '@nestjs/swagger'
import { BaseTransactionDto } from './base.transaction.dto'

export class CreateTransactionDto extends PickType(BaseTransactionDto, [
  'type',
  'paymentMethod',
  'amount',
  'debitAccount',
  'creditAccount',
  'description',
  'status',
  'payment',
  'payout'
]) {}
