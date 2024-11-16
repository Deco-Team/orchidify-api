import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class RejectClassRequestDto {
  @ApiProperty({ type: String, example: 'Class Request Reject Reason' })
  @IsString()
  @MaxLength(500)
  rejectReason: string
}
