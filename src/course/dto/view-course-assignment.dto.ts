import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from '@src/class/dto/assignment.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewCourseAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty()
  index: string
}
export class ViewCourseAssignmentDetailDataResponse extends DataResponse(ViewCourseAssignmentDetailResponse) {}
