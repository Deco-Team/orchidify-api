import { ApiProperty } from '@nestjs/swagger'
import { BaseReportDto } from './base.report.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { ReportType } from '@report/contracts/constant'
import { IsEnum } from 'class-validator'

export class QueryReportDto {
  @ApiProperty({
    enum: ReportType
  })
  @IsEnum(ReportType)
  type: ReportType
}

class ReportListItemResponse extends BaseReportDto {}
class ReportListResponse {
  @ApiProperty({ type: ReportListItemResponse, isArray: true })
  docs: ReportListItemResponse[]
}
export class ReportListDataResponse extends DataResponse(ReportListResponse) {}

class ReportDetailResponse extends BaseReportDto {}
export class ReportDetailDataResponse extends DataResponse(ReportDetailResponse) {}
