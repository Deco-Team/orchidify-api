import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'

export class ProcessRecruitmentApplicationDto {
  @ApiProperty({ type: String, example: 'https://meet.google.com/' })
  @IsUrl()
  meetingUrl: string
}
