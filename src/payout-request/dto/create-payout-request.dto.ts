import { PickType } from '@nestjs/swagger'
import { BasePayoutRequestDto } from './base.payout-request.dto'
import { Types } from 'mongoose'

export class CreatePayoutRequestDto extends PickType(BasePayoutRequestDto, ['description', 'amount']) {
  createdBy: Types.ObjectId
}
