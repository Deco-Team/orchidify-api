import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class RejectRecruitmentProcessDto {
  @ApiProperty({ type: String, example: 'Recruitment Process Reject Reason' })
  @IsString()
  @MaxLength(100)
  rejectReason: string
}
