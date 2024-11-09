import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class RejectPayoutRequestDto {
  @ApiProperty({ type: String, example: 'Payout Request reject reason' })
  @IsString()
  @MaxLength(500)
  rejectReason: string
}
