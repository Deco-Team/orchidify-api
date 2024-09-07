import { PickType } from '@nestjs/swagger'
import { BaseInstructorDto } from './base.instructor.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { INSTRUCTOR_PROFILE_PROJECTION } from '@instructor/contracts/constant'

class InstructorProfileResponse extends PickType(BaseInstructorDto, INSTRUCTOR_PROFILE_PROJECTION) {}

export class InstructorProfileDataResponse extends DataResponse(InstructorProfileResponse) {}
