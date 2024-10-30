import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import { BaseAssignmentSubmissionDto } from './assignment-submission.dto'

class SubmissionLearnerDetailResponse extends PickType(BaseLearnerDto, ['_id', 'name', 'email']) {}

class AssignmentSubmissionItemResponse {
  @ApiProperty({ type: SubmissionLearnerDetailResponse })
  learner: SubmissionLearnerDetailResponse

  @ApiPropertyOptional({ type: BaseAssignmentSubmissionDto })
  submission: BaseAssignmentSubmissionDto
}
class AssignmentSubmissionListResponse {
  @ApiProperty({ type: AssignmentSubmissionItemResponse, isArray: true })
  docs: AssignmentSubmissionItemResponse[]
}
export class AssignmentSubmissionListDataResponse extends DataResponse(AssignmentSubmissionListResponse) {}

class ViewAssignmentSubmissionDetailResponse extends BaseAssignmentSubmissionDto {
  @ApiProperty({ type: SubmissionLearnerDetailResponse })
  learner: SubmissionLearnerDetailResponse
}
export class ViewAssignmentSubmissionDetailDataResponse extends DataResponse(ViewAssignmentSubmissionDetailResponse) {}
