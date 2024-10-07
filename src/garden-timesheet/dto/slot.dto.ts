import { IsDateString, IsMongoId } from 'class-validator'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { SlotNumber, SlotStatus } from '@common/contracts/constant'

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
  courseId: string
}

export class CreateSlotDto extends PickType(BaseSlotDto, ['start', 'end', 'status']) {}
