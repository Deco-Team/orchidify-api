import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseAttendanceDto } from './base.attendance.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AttendanceStatus } from '@common/contracts/constant'

export class TakeAttendanceDto extends PickType(BaseAttendanceDto, ['status', 'note', 'learnerId']) {
  @ApiProperty({ type: String, enum: [AttendanceStatus.ABSENT, AttendanceStatus.PRESENT] })
  @IsEnum([AttendanceStatus.ABSENT, AttendanceStatus.PRESENT])
  status: AttendanceStatus
}

export class TakeMultipleAttendanceDto {
  @ApiProperty({ type: TakeAttendanceDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @Type(() => TakeAttendanceDto)
  @ValidateNested({ each: true })
  attendances: TakeAttendanceDto[]
}
