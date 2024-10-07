import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsDateString, IsEnum, IsMongoId } from 'class-validator'
import { TimesheetType } from '@common/contracts/constant'

export class QueryAllGardenTimesheetDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @IsDateString({ strict: true })
  date: Date

  @ApiProperty({ enum: TimesheetType })
  @IsEnum(TimesheetType)
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
