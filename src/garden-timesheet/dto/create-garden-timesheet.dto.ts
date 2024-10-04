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
    this.date = startOfDate.toDate()
    this.status = GardenTimesheetStatus.ACTIVE
    this.slots = []
    // this.slots = [
    //   {
    //     start: startOfDate.clone().add(7, 'hour').toDate(),
    //     end: startOfDate.clone().add(9, 'hour').toDate(),
    //     status: SlotStatus.AVAILABLE
    //   },
    //   {
    //     start: startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate(),
    //     end: startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate(),
    //     status: SlotStatus.AVAILABLE
    //   },
    //   {
    //     start: startOfDate.clone().add(13, 'hour').toDate(),
    //     end: startOfDate.clone().add(15, 'hour').toDate(),
    //     status: SlotStatus.AVAILABLE
    //   },
    //   {
    //     start: startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate(),
    //     end: startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate(),
    //     status: SlotStatus.AVAILABLE
    //   }
    // ]
  }
}

// {
//   "_id": "67000d29252ac3ea51977f85",
//   "status": "ACTIVE",
//   "date": "2024-09-30T17:00:00.000Z",
//   "gardenId": "66e6a5df0c505c7cee81cc5d",
//   "slots": [
//     {
//       "start": "2024-10-01T00:00:00.000Z",
//       "end": "2024-10-01T02:00:00.000Z",
//       "status": "AVAILABLE",
//       "_id": "67000d29252ac3ea51977f86"
//     },
//     {
//       "start": "2024-10-01T02:30:00.000Z",
//       "end": "2024-10-01T04:30:00.000Z",
//       "status": "AVAILABLE",
//       "_id": "67000d29252ac3ea51977f87"
//     },
//     {
//       "start": "2024-10-01T06:00:00.000Z",
//       "end": "2024-10-01T08:00:00.000Z",
//       "status": "AVAILABLE",
//       "_id": "67000d29252ac3ea51977f88"
//     },
//     {
//       "start": "2024-10-01T08:30:00.000Z",
//       "end": "2024-10-01T10:30:00.000Z",
//       "status": "AVAILABLE",
//       "_id": "67000d29252ac3ea51977f89"
//     }
//   ],
//   "createdAt": "2024-10-04T15:43:37.910Z",
//   "updatedAt": "2024-10-04T15:43:37.910Z",
//   "id": "67000d29252ac3ea51977f85"
// },
