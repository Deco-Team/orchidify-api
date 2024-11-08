import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { BaseFeedbackDto } from '@feedback/dto/base.feedback.dto'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import {
  FEEDBACK_LEANER_DETAIL,
  FEEDBACK_LIST_PROJECTION,
  INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION
} from '@feedback/contracts/constant'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { Types } from 'mongoose'
import { Type } from 'class-transformer'

export class QueryFeedbackDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number

  courseId: Types.ObjectId
}

class FeedbackLearnerDetailResponse extends PickType(BaseLearnerDto, FEEDBACK_LEANER_DETAIL) {}

/**
 * Class Feedback
 */
class FeedbackListItemResponse extends PickType(BaseFeedbackDto, FEEDBACK_LIST_PROJECTION) {
  @ApiProperty({ type: FeedbackLearnerDetailResponse })
  learner: FeedbackLearnerDetailResponse
}
class ClassFeedbackListResponse {
  @ApiProperty({ type: FeedbackListItemResponse, isArray: true })
  docs: FeedbackListItemResponse[]
}
export class ClassFeedbackListDataResponse extends DataResponse(ClassFeedbackListResponse) {}

class InstructorViewFeedbackListItemResponse extends PickType(
  BaseFeedbackDto,
  INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION
) {}
class InstructorViewClassFeedbackListResponse {
  @ApiProperty({ type: InstructorViewFeedbackListItemResponse, isArray: true })
  docs: InstructorViewFeedbackListItemResponse[]
}
export class InstructorViewClassFeedbackListDataResponse extends DataResponse(
  InstructorViewClassFeedbackListResponse
) {}

/**
 * Course Feedback
 */
class CourseFeedbackListResponse extends PaginateResponse(FeedbackListItemResponse) {}
export class CourseFeedbackListDataResponse extends DataResponse(CourseFeedbackListResponse) {}

class InstructorViewCourseFeedbackListResponse extends PaginateResponse(InstructorViewFeedbackListItemResponse) {}
export class InstructorViewCourseFeedbackListDataResponse extends DataResponse(
  InstructorViewCourseFeedbackListResponse
) {}
