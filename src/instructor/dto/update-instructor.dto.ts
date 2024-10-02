import { PickType } from '@nestjs/swagger'
import { BaseInstructorDto } from './base.instructor.dto'

export class UpdateInstructorDto extends PickType(BaseInstructorDto, ['name', 'phone', 'dateOfBirth']) {}
