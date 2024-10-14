import { ApiProperty, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, Max, Min } from 'class-validator'
import { SlotNumber, Weekday } from '@common/contracts/constant'
import { Transform, Type } from 'class-transformer'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { FutureMinMonth } from '@common/validators/future-min-month.validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'

export class QueryAvailableGardenDto {
  @ApiProperty({ type: Date })
  @FutureMinMonth(1)
  @FutureMaxMonth(3)
  startDate: Date

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  duration: number

  @ApiProperty({ enum: Weekday, isArray: true })
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value)))
  weekdays: Weekday[]

  @ApiProperty({ enum: SlotNumber, isArray: true })
  @IsArray()
  @IsEnum(SlotNumber, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(Number) : Array(value).map(Number)))
  slotNumbers: SlotNumber[]
}

export class AvailableGardenListItemResponse extends PickType(BaseGardenDto, ['_id', 'name']) {}
class AvailableGardenListResponse {
  @ApiProperty({ type: AvailableGardenListItemResponse, isArray: true })
  docs: AvailableGardenListItemResponse[]
}
export class AvailableGardenListDataResponse extends DataResponse(AvailableGardenListResponse) {}
