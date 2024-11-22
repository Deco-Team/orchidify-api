import { ApiProperty } from '@nestjs/swagger'
import * as moment from 'moment-timezone'
import { DataResponse } from '@common/contracts/openapi-builder'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, Max, Min } from 'class-validator'
import { SlotNumber, Weekday } from '@common/contracts/constant'
import { FutureMinMonth } from '@common/validators/future-min-month.validator'
import { FutureMaxMonth } from '@common/validators/future-max-month.validator'
import { Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { VN_TIMEZONE } from '@src/config'

export class QueryAvailableTimeDto {
  @ApiProperty({ type: Date })
  // @FutureMinMonth(1)
  @FutureMinMonth(0)
  @FutureMaxMonth(3)
  @Transform(({ value }) => (moment(value).tz(VN_TIMEZONE).startOf('date').toISOString()))
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
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value)))
  weekdays: Weekday[]

  instructorId: Types.ObjectId
}

class AvailableTimeOfGardens {
  slotNumbers: SlotNumber[]
  gardenId: Types.ObjectId
}

export class ViewAvailableTimeResponse {
  @ApiProperty({ enum: SlotNumber, isArray: true })
  slotNumbers: SlotNumber[]

  availableTimeOfGardens?: AvailableTimeOfGardens[]

  notAvailableSlotsByInstructor?: SlotNumber[]
}
export class ViewAvailableTimeDataResponse extends DataResponse(ViewAvailableTimeResponse) {}
