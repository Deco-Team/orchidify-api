import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from '@src/class/dto/assignment.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewCourseAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty({ type: Number })
  sessionNumber: number
}
export class ViewCourseAssignmentDetailDataResponse extends DataResponse(ViewCourseAssignmentDetailResponse) {}
