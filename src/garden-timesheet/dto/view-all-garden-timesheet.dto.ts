import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsEnum, IsMongoId } from 'class-validator'
import { TimesheetType } from '@common/contracts/constant'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'

export class QueryAllGardenTimesheetDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  @ApiProperty({ enum: [TimesheetType.WEEK] })
  @IsEnum([TimesheetType.WEEK])
  type: TimesheetType
}

export class ViewAllGardenTimesheetItemResponse {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Date })
  start: Date

  @ApiProperty({ type: Date })
  end: Date

  @ApiProperty({ type: String })
  status: string

  @ApiPropertyOptional({ type: String })
  classId: string

  // @ApiProperty({ type: Date })
  // createdAt: Date

  // @ApiProperty({ type: Date })
  // updatedAt: Date
}
class ViewAllGardenTimesheetListResponse {
  @ApiProperty({ type: ViewAllGardenTimesheetItemResponse, isArray: true })
  docs: ViewAllGardenTimesheetItemResponse[]
}
export class ViewAllGardenTimesheetListDataResponse extends DataResponse(ViewAllGardenTimesheetListResponse) {}
