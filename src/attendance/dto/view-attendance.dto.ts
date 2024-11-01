import { ApiProperty, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAttendanceDto } from '@attendance/dto/base.attendance.dto'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import { Types } from 'mongoose'
import { ATTENDANCE_LIST_PROJECTION } from '@attendance/contracts/constant'
import { BaseSlotDto } from '@garden-timesheet/dto/slot.dto'

export class QueryAttendanceDto {
  slotId: Types.ObjectId
}

class AttendanceLearnerDetailResponse extends PickType(BaseLearnerDto, ['_id', 'name', 'avatar']) {}

class AttendanceListItemResponse extends PickType(BaseAttendanceDto, ATTENDANCE_LIST_PROJECTION) {
  @ApiProperty({ type: AttendanceLearnerDetailResponse })
  learner: AttendanceLearnerDetailResponse
}
class AttendanceListResponse {
  @ApiProperty({ type: AttendanceListItemResponse, isArray: true })
  docs: AttendanceListItemResponse[]

  @ApiProperty({ type: BaseSlotDto })
  slot: BaseSlotDto
}
export class AttendanceListDataResponse extends DataResponse(AttendanceListResponse) {}
