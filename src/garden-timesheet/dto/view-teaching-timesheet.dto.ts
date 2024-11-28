import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsEnum, IsMongoId } from 'class-validator'
import { SlotNumber, TimesheetType } from '@common/contracts/constant'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'
import { BaseSlotMetadataDto } from './slot.dto'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'

export class QueryInstructorTimesheetDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
  type: TimesheetType

  @ApiProperty({ type: String })
  @IsMongoId()
  instructorId: string
}

export class QueryTeachingTimesheetDto extends PickType(QueryInstructorTimesheetDto, ['date', 'type']) {
  instructorId: string
}

class TeachingTimesheetGardenDetailResponse extends PickType(BaseGardenDto, ['name']) {}
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

  @ApiPropertyOptional({ type: TeachingTimesheetGardenDetailResponse })
  garden: TeachingTimesheetGardenDetailResponse
}
class ViewTeachingTimesheetListResponse {
  @ApiProperty({ type: ViewTeachingTimesheetItemResponse, isArray: true })
  docs: ViewTeachingTimesheetItemResponse[]
}
export class ViewTeachingTimesheetListDataResponse extends DataResponse(ViewTeachingTimesheetListResponse) {}
