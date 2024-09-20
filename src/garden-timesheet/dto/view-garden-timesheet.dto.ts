import { ApiProperty, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsDateString, IsEnum, IsMongoId } from 'class-validator'
import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto'
import { VIEW_GARDEN_TIMESHEET_LIST_PROJECTION } from '@garden-timesheet/contracts/constant'
import { TimesheetType } from '@common/contracts/constant'

export class QueryGardenTimesheetDto {
  @ApiProperty({ type: String, example: 'gardenId' })
  @IsMongoId()
  gardenId: string

  @ApiProperty({ type: Date, example: '2024-09-20' })
  @IsDateString({ strict: true })
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
  type: TimesheetType
}

class ViewGardenTimesheetItemResponse extends PickType(BaseGardenTimesheetDto, VIEW_GARDEN_TIMESHEET_LIST_PROJECTION) {}
class ViewGardenTimesheetListResponse {
  @ApiProperty({ type: ViewGardenTimesheetItemResponse, isArray: true })
  docs: ViewGardenTimesheetItemResponse[]
}
export class ViewGardenTimesheetListDataResponse extends DataResponse(ViewGardenTimesheetListResponse) {}
