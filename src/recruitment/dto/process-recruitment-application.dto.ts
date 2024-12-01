import { FutureMinDay } from '@common/validators/future-min-day.validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'

export class ProcessRecruitmentApplicationDto {
  @ApiProperty({ type: String, example: 'https://meet.google.com/' })
  @IsUrl()
  meetingUrl: string

  @ApiProperty({ type: Date })
  @FutureMinDay(0)
  meetingDate: Date
}
