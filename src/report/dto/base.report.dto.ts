import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ReportType } from '@report/contracts/constant'

export class BaseReportDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, enum: ReportType })
  type: ReportType

  @ApiProperty({ type: Object })
  data: Record<string, any>
}
