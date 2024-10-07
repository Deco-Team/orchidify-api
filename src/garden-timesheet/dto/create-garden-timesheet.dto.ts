import { PickType } from '@nestjs/swagger'
import * as moment from 'moment-timezone'
import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto'
import { CreateSlotDto } from './slot.dto'
import { Types } from 'mongoose'
import { GardenTimesheetStatus } from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'

export class CreateGardenTimesheetDto extends PickType(BaseGardenTimesheetDto, ['date', 'status', 'gardenId', 'gardenMaxClass']) {
  slots: CreateSlotDto[]

  constructor(gardenId: Types.ObjectId, date: Date, gardenMaxClass: number) {
    const startOfDate = moment(date).tz(VN_TIMEZONE).startOf('day')
    super()
    this.gardenId = gardenId
    this.date = startOfDate.toDate()
    this.status = GardenTimesheetStatus.ACTIVE
    this.gardenMaxClass = gardenMaxClass
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
//   "_id": {
//     "$oid": "670010c4d9e04f5b171e0c54"
//   },
//   "status": "ACTIVE",
//   "date": {
//     "$date": "2024-10-28T17:00:00.000Z"
//   },
//   "gardenId": {
//     "$oid": "66e6a5df0c505c7cee81cc5d"
//   },
//   "slots": [
//     {
//       "start": {
//         "$date": "2024-10-29T00:00:00.000Z"
//       },
//       "end": {
//         "$date": "2024-10-29T02:00:00.000Z"
//       },
//       "status": "NOT_AVAILABLE",
//       "classId": "classId",
//       "slotNumber": 1
//     },
//     {
//       "start": {
//         "$date": "2024-10-29T02:30:00.000Z"
//       },
//       "end": {
//         "$date": "2024-10-29T04:00:00.000Z"
//       },
//       "status": "NOT_AVAILABLE",
//       "classId": "classId2",
//       "slotNumber": 2
//     }
//   ],
//   "__v": 0,
//   "createdAt": {
//     "$date": "2024-10-04T15:59:00.743Z"
//   },
//   "updatedAt": {
//     "$date": "2024-10-04T15:59:00.743Z"
//   },
//   "gardenMaxClass": 1
// }