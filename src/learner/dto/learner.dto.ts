import { DataResponse } from '@common/contracts/openapi-builder'
import { Learner } from '@src/learner/schemas/learner.schema'

export class LearnerResponseDto extends DataResponse(Learner) {}
