import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseReportDto } from './base.report.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator'
import { ClassStatus, StaffStatus } from '@common/contracts/constant'
import { Type } from 'class-transformer'

export class QueryReportByMonthDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2024)
  @Max(2024)
  year: number
}

export class QueryReportByWeekDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @IsDateString({ strict: true })
  date: Date
}

// View Report Data Total Summary
class ReportTotalSummaryReportListItemResponse extends PickType(BaseReportDto, ['_id', 'type', 'data']) {}
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

// View Report Revenue Data By Month
class ReportRevenueResponse {
  @ApiProperty({ type: Number })
  total: number
}
class ReportRevenueByMonthListItemResponse {
  @ApiProperty({ type: ReportRevenueResponse })
  revenue: ReportRevenueResponse
}
class ReportRevenueByMonthListResponse {
  @ApiProperty({ type: ReportRevenueByMonthListItemResponse, isArray: true })
  docs: ReportRevenueByMonthListItemResponse[]
}
export class ReportRevenueByMonthListDataResponse extends DataResponse(ReportRevenueByMonthListResponse) {}

// View Report Staff Data By Status
class ReportStaffByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: StaffStatus })
  status: StaffStatus
}
class ReportStaffByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportStaffByStatusListItemResponse, isArray: true })
  docs: ReportStaffByStatusListItemResponse[]
}
export class ReportStaffByStatusListDataResponse extends DataResponse(ReportStaffByStatusListResponse) {}

// View Report Transaction Data By Date
class ReportTransactionByDateListItemResponse {
  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: Number })
  paymentAmount: number

  @ApiProperty({ type: Number })
  payoutAmount: number
}
class ReportTransactionByDateListResponse {
  @ApiProperty({ type: ReportTransactionByDateListItemResponse, isArray: true })
  docs: ReportTransactionByDateListItemResponse[]
}
export class ReportTransactionByDateListDataResponse extends DataResponse(ReportTransactionByDateListResponse) {}
