import { ApiProperty, PickType } from '@nestjs/swagger'
import * as moment from 'moment-timezone'
import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto'
import { VN_TIMEZONE } from '@src/config'
import { FutureMinDay } from '@common/validators/future-min-day.validator'
import { Transform } from 'class-transformer'

export class UpdateGardenTimesheetDto extends PickType(BaseGardenTimesheetDto, ['gardenId', 'status']) {
  @ApiProperty({ type: Date })
  // BR-28: Garden timesheet is not allowed to update for the next 7 days starting from today's date.
  @FutureMinDay(7)
  @Transform(({ value }) => moment(value).tz(VN_TIMEZONE).startOf('date').toISOString())
  date: Date
}
