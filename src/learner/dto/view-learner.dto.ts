import { PickType } from '@nestjs/swagger'
import { BaseLearnerDto } from './base.learner.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { LEARNER_PROFILE_PROJECTION } from '@learner/contracts/constant'

class LearnerProfileResponse extends PickType(BaseLearnerDto, LEARNER_PROFILE_PROJECTION) {}

export class LearnerProfileDataResponse extends DataResponse(LearnerProfileResponse) {}
