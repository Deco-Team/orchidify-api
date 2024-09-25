import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from '@course/dto/assignment.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewTemplateAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty()
  index: string
}
export class ViewTemplateAssignmentDetailDataResponse extends DataResponse(ViewTemplateAssignmentDetailResponse) {}
