import { ApiProperty, PickType } from '@nestjs/swagger'
import * as moment from 'moment-timezone'
import { BaseClassRequestDto } from './base.class-request.dto'
import { SlotNumber, Weekday } from '@common/contracts/constant'
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { Transform } from 'class-transformer'
import { VN_TIMEZONE } from '@src/config'

export class CreatePublishClassRequestDto extends PickType(BaseClassRequestDto, ['description', 'courseId']) {
  @ApiProperty({ type: Date })
  // @FutureMinMonth(1)
  @FutureMaxMonth(3)
  @Transform(({ value }) => (moment(value).tz(VN_TIMEZONE).startOf('date').toISOString()))
  startDate: Date

  @ApiProperty({ enum: Weekday, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value)))
  weekdays: Weekday[]

  @ApiProperty({ enum: SlotNumber, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(Number) : Array(value).map(Number)))
  slotNumbers: SlotNumber[]
}
