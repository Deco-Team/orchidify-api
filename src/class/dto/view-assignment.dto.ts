import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from './assignment.dto'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseAssignmentSubmissionDto } from './assignment-submission.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

class AssignmentInstructorDetailResponse extends PickType(BaseInstructorDto, ['_id', 'name', 'idCardPhoto', 'avatar']) {}
class ViewAssignmentDetailResponse extends BaseAssignmentDto {
  @ApiProperty({ type: Number })
  sessionNumber: number

  @ApiPropertyOptional({ type: BaseAssignmentSubmissionDto })
  submission: BaseAssignmentSubmissionDto

  @ApiProperty({ type: AssignmentInstructorDetailResponse })
  instructor: AssignmentInstructorDetailResponse
}
export class ViewAssignmentDetailDataResponse extends DataResponse(ViewAssignmentDetailResponse) {}
