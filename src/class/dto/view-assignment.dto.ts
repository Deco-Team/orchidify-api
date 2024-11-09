import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from './assignment.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseAssignmentSubmissionDto } from './assignment-submission.dto'

class ViewAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty({ type: Number })
  sessionNumber: number

  @ApiPropertyOptional({ type: BaseAssignmentSubmissionDto })
  submission: BaseAssignmentSubmissionDto
}
export class ViewAssignmentDetailDataResponse extends DataResponse(ViewAssignmentDetailResponse) {}
