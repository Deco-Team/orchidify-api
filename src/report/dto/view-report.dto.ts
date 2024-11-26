import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseReportDto } from './base.report.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { ClassStatus } from '@common/contracts/constant'

export class QueryReportClassByMonthDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(2024)
  @Max(2024)
  year: number
}

// View Report Data Total Summary
class ReportTotalSummaryReportListItemResponse extends BaseReportDto {}
class ReportTotalSummaryListResponse {
  @ApiProperty({ type: ReportTotalSummaryReportListItemResponse, isArray: true })
  docs: ReportTotalSummaryReportListItemResponse[]
}
export class ReportTotalSummaryListDataResponse extends DataResponse(ReportTotalSummaryListResponse) {}

// View Report User Data By Month
class ReportUserQuantityResponse {
  @ApiProperty({ type: Number })
  quantity: number
}
class ReportUserByMonthListItemResponse {
  @ApiProperty({ type: ReportUserQuantityResponse })
  learner: ReportUserQuantityResponse

  @ApiProperty({ type: ReportUserQuantityResponse })
  instructor: ReportUserQuantityResponse
}
class ReportUserByMonthListResponse {
  @ApiProperty({ type: ReportUserByMonthListItemResponse, isArray: true })
  docs: ReportUserByMonthListItemResponse[]
}
export class ReportUserByMonthListDataResponse extends DataResponse(ReportUserByMonthListResponse) {}

// View Report Class Data By Status
class ReportClassByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: ClassStatus })
  status: ClassStatus
}
class ReportClassByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportClassByStatusListItemResponse, isArray: true })
  docs: ReportClassByStatusListItemResponse[]
}
export class ReportClassByStatusListDataResponse extends DataResponse(ReportClassByStatusListResponse) {}
