import { IsDateString, IsMongoId } from 'class-validator'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { SlotStatus } from '@common/contracts/constant'

export class BaseSlotDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  startTime: Date

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  endTime: Date

  @ApiProperty({ enum: SlotStatus })
  status: SlotStatus

  @ApiProperty({ type: String })
  courseId: string
}

export class CreateSlotDto extends PickType(BaseSlotDto, ['startTime', 'endTime', 'status']) {}
