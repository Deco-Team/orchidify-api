import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseClassRequestDto } from './base.class-request.dto'
import { SlotNumber, Weekday } from '@common/contracts/constant'
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsInt, Max, Min } from 'class-validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { FutureMinMonth } from '@common/validators/future-min-month.validator'

export class CreatePublishClassRequestDto extends PickType(BaseClassRequestDto, ['description', 'courseId']) {
  @ApiProperty({ type: Date })
  @FutureMinMonth(1)
  @FutureMaxMonth(3)
  startDate: Date

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  @Max(16)
  duration: number

  @ApiProperty({ enum: Weekday, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  weekdays: Weekday[]

  @ApiProperty({ enum: SlotNumber, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ArrayUnique()
  slotNumbers: SlotNumber[]
}
