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

class CreateCustomTokenFirebaseResponse {
  @ApiProperty({ type: String })
  token: string
}
export class CreateCustomTokenFirebaseDataResponse extends DataResponse(CreateCustomTokenFirebaseResponse) {}