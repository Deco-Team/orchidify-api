import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsMongoId } from 'class-validator'
import { SlotNumber, TimesheetType } from '@common/contracts/constant'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'
import { BaseSlotDto, BaseSlotMetadataDto } from './slot.dto'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

export class QuerySlotByGardenIdsDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  type = TimesheetType.DAY

  gardenIds: string[]
}

export class QueryInactiveTimesheetByGardenDto extends PickType(QuerySlotByGardenIdsDto, ['date']) {
  @ApiProperty({ type: String })
  @IsMongoId()
  gardenId: string
}

class SLotInstructorDetailResponse extends PickType(BaseInstructorDto, ['name']) {}
class SlotGardenDetailResponse extends PickType(BaseGardenDto, ['name']) {}
export class ViewSlotItemResponse {
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

  @ApiPropertyOptional({ type: SLotInstructorDetailResponse })
  instructor: SLotInstructorDetailResponse

  @ApiPropertyOptional({ type: SlotGardenDetailResponse })
  garden: SlotGardenDetailResponse
}
class ViewSlotListResponse {
  @ApiProperty({ type: ViewSlotItemResponse, isArray: true })
  docs: ViewSlotItemResponse[]
}
export class ViewSlotListDataResponse extends DataResponse(ViewSlotListResponse) {}
