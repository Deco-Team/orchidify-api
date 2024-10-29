import { IsDateString, IsMongoId } from 'class-validator'
import * as moment from 'moment-timezone'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { SlotNumber, SlotStatus } from '@common/contracts/constant'
import { Types } from 'mongoose'
import { VN_TIMEZONE } from '@src/config'
import { BaseClassDto } from '@class/dto/base.class.dto'
import { ClassCourseDetailResponse, ClassGardenDetailResponse } from '@class/dto/view-class.dto'
import { SLOT_CLASS_DETAIL_PROJECTION } from '@garden-timesheet/contracts/constant'

export class BaseSlotMetadataDto extends PickType(BaseClassDto, ['code', 'title']) {
  @ApiProperty({ type: Number })
  sessionNumber?: number

  @ApiProperty({ type: String, example: 'Session title' })
  sessionTitle?: string
}

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

  @ApiPropertyOptional({ type: String })
  instructorId: string | Types.ObjectId

  @ApiPropertyOptional({ type: String })
  sessionId: string | Types.ObjectId

  @ApiPropertyOptional({ type: String })
  classId: string | Types.ObjectId

  @ApiPropertyOptional({ type: BaseSlotMetadataDto })
  metadata: BaseSlotMetadataDto

  @ApiPropertyOptional({ type: Boolean })
  hasTakenAttendance: boolean
}

export class CreateSlotDto extends PickType(BaseSlotDto, [
  'slotNumber',
  'start',
  'end',
  'status',
  'instructorId',
  'sessionId',
  'classId',
  'metadata'
]) {
  constructor(
    slotNumber: SlotNumber,
    date: Date,
    instructorId?: Types.ObjectId,
    sessionId?: Types.ObjectId,
    classId?: Types.ObjectId,
    metadata?: BaseSlotMetadataDto
  ) {
    const startOfDate = moment(date).tz(VN_TIMEZONE).startOf('day')
    super()
    this.slotNumber = slotNumber
    this.status = SlotStatus.NOT_AVAILABLE
    this.instructorId = instructorId
    this.sessionId = sessionId
    this.classId = classId
    this.metadata = metadata
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

class SlotClassDetailResponse extends PickType(BaseClassDto, SLOT_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse
}
export class ViewSlotDto extends BaseSlotDto {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: SlotClassDetailResponse })
  class: SlotClassDetailResponse

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
