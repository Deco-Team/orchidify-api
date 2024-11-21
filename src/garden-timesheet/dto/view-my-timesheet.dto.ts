import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsEnum, IsMongoId } from 'class-validator'
import { SlotNumber, TimesheetType } from '@common/contracts/constant'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { PastMaxMonth } from '@common/validators/past-max-month.validator'
import { BaseSlotDto, BaseSlotMetadataDto } from './slot.dto'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

export class QueryMyTimesheetDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @FutureMaxMonth(12)
  @PastMaxMonth(24)
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
  type: TimesheetType

  learnerId: string
}


class MyTimesheetInstructorDetailResponse extends PickType(BaseInstructorDto, ['name']) {}
class MyTimesheetGardenDetailResponse extends PickType(BaseGardenDto, ['name']) {}
class MyTimesheetAttendanceDetailResponse extends PickType(BaseSlotDto, ['status']) {}
export class ViewMyTimesheetItemResponse {
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

  @ApiPropertyOptional({ type: MyTimesheetInstructorDetailResponse })
  instructor: MyTimesheetInstructorDetailResponse

  @ApiPropertyOptional({ type: MyTimesheetGardenDetailResponse })
  garden: MyTimesheetGardenDetailResponse

  @ApiPropertyOptional({ type: MyTimesheetAttendanceDetailResponse })
  attendance: MyTimesheetAttendanceDetailResponse
}
class ViewMyTimesheetListResponse {
  @ApiProperty({ type: ViewMyTimesheetItemResponse, isArray: true })
  docs: ViewMyTimesheetItemResponse[]
}
export class ViewMyTimesheetListDataResponse extends DataResponse(ViewMyTimesheetListResponse) {}
