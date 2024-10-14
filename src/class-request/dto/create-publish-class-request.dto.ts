import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseClassRequestDto } from './base.class-request.dto'
import { SlotNumber, Weekday } from '@common/contracts/constant'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, Max, Min } from 'class-validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { FutureMinMonth } from '@common/validators/future-min-month.validator'
import { Transform } from 'class-transformer'

export class CreatePublishClassRequestDto extends PickType(BaseClassRequestDto, ['description', 'courseId']) {
  @ApiProperty({ type: Date })
  @FutureMinMonth(1)
  @FutureMaxMonth(3)
  startDate: Date

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  @Max(12)
  duration: number

  @ApiProperty({ enum: Weekday, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value)))
  weekdays: Weekday[]

  @ApiProperty({ enum: SlotNumber, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(Number) : Array(value).map(Number)))
  slotNumbers: SlotNumber[]
}
