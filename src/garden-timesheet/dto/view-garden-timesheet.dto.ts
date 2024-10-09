import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsEnum, IsMongoId } from 'class-validator'
// import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto'
// import { VIEW_GARDEN_TIMESHEET_LIST_PROJECTION } from '@garden-timesheet/contracts/constant'
import { SlotNumber, TimesheetType } from '@common/contracts/constant'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'

export class QueryGardenTimesheetDto {
  @ApiProperty({ type: String, example: 'gardenId' })
  @IsMongoId()
  gardenId: string

  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
  type: TimesheetType
}

export class ViewGardenTimesheetItemResponse {
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

  @ApiPropertyOptional({ type: Number, enum: SlotNumber })
  slotNumber: SlotNumber
}
class ViewGardenTimesheetListResponse {
  @ApiProperty({ type: ViewGardenTimesheetItemResponse, isArray: true })
  docs: ViewGardenTimesheetItemResponse[]
}
export class ViewGardenTimesheetListDataResponse extends DataResponse(ViewGardenTimesheetListResponse) {}
