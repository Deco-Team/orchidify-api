import { IsDateString, IsMongoId } from 'class-validator'
import * as moment from 'moment-timezone'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { SlotNumber, SlotStatus } from '@common/contracts/constant'
import { Types } from 'mongoose'
import { VN_TIMEZONE } from '@src/config'

export class BaseSlotDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ enum: SlotNumber })
  slotNumber: SlotNumber

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  start: Date

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  end: Date

  @ApiProperty({ enum: SlotStatus })
  status: SlotStatus

  @ApiProperty({ type: String })
  classId: string | Types.ObjectId
}

export class CreateSlotDto extends PickType(BaseSlotDto, ['slotNumber', 'start', 'end', 'status', 'classId']) {
  constructor(slotNumber: SlotNumber, date: Date, classId?: Types.ObjectId) {
    const startOfDate = moment(date).tz(VN_TIMEZONE).startOf('day')
    super()
    this.slotNumber = slotNumber
    this.status = SlotStatus.NOT_AVAILABLE
    this.classId = classId
    switch (slotNumber) {
      case SlotNumber.ONE:
        this.start = startOfDate.clone().add(7, 'hour').toDate()
        this.end = startOfDate.clone().add(9, 'hour').toDate()
        break
      case SlotNumber.TWO:
        this.start = startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate()
        this.end = startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate()
        break
      case SlotNumber.THREE:
        this.start = startOfDate.clone().add(13, 'hour').toDate()
        this.end = startOfDate.clone().add(15, 'hour').toDate()
        break
      case SlotNumber.FOUR:
        this.start = startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate()
        this.end = startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate()
        break
    }
  }
}
