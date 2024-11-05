import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'
import { BasePayoutRequestDto } from './base.payout-request.dto'

export class RejectPayoutRequestDto extends PickType(BasePayoutRequestDto, ['rejectReason']) {}
