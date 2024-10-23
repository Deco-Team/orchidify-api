import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsEnum, IsMongoId } from 'class-validator'
import { SlotNumber, TimesheetType } from '@common/contracts/constant'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'
import { BaseSlotMetadataDto } from './slot.dto'

export class QueryTeachingTimesheetDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
  type: TimesheetType

  instructorId: string
}

export class ViewTeachingTimesheetItemResponse {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiPropertyOptional({ type: Number, enum: SlotNumber })
  slotNumber: SlotNumber

  @ApiProperty({ type: Date })
  start: Date

  @ApiProperty({ type: Date })
  end: Date

  @ApiProperty({ type: String })
  status: string

  @ApiPropertyOptional({ type: String })
  classId: string

  @ApiPropertyOptional({ type: BaseSlotMetadataDto })
  metadata: BaseSlotMetadataDto
}
class ViewTeachingTimesheetListResponse {
  @ApiProperty({ type: ViewTeachingTimesheetItemResponse, isArray: true })
  docs: ViewTeachingTimesheetItemResponse[]
}
export class ViewTeachingTimesheetListDataResponse extends DataResponse(ViewTeachingTimesheetListResponse) {}
