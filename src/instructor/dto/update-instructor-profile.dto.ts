import { PartialType, PickType } from '@nestjs/swagger'
import { BaseInstructorDto } from './base.instructor.dto'

export class UpdateInstructorProfileDto extends PartialType(
  PickType(BaseInstructorDto, ['avatar', 'bio', 'paymentInfo', 'certificates'])
) {}
