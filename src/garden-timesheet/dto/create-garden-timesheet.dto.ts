import { PickType } from '@nestjs/swagger'
import * as moment from 'moment-timezone'
import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto'
import { CreateSlotDto } from './slot.dto'
import { Types } from 'mongoose'
import { GardenTimesheetStatus, SlotStatus } from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'

export class CreateGardenTimesheetDto extends PickType(BaseGardenTimesheetDto, ['date', 'status', 'gardenId']) {
  slots: CreateSlotDto[]

  constructor(gardenId: Types.ObjectId, date: Date) {
    const startOfDate = moment(date).tz(VN_TIMEZONE).startOf('day')
    super()
    this.gardenId = gardenId
    this.date = date
    this.status = GardenTimesheetStatus.ACTIVE
    this.slots = [
      {
        startTime: startOfDate.clone().add(7, 'hour').toDate(),
        endTime: startOfDate.clone().add(9, 'hour').toDate(),
        status: SlotStatus.AVAILABLE
      },
      {
        startTime: startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate(),
        endTime: startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate(),
        status: SlotStatus.AVAILABLE
      },
      {
        startTime: startOfDate.clone().add(13, 'hour').toDate(),
        endTime: startOfDate.clone().add(15, 'hour').toDate(),
        status: SlotStatus.AVAILABLE
      },
      {
        startTime: startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate(),
        endTime: startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate(),
        status: SlotStatus.AVAILABLE
      },
    ]
  }
}
