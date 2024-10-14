import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from './assignment.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty({ type: Number })
  sessionNumber: number
}
export class ViewAssignmentDetailDataResponse extends DataResponse(ViewAssignmentDetailResponse) {}
