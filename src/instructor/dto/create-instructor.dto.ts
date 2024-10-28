import { PickType } from '@nestjs/swagger'
import { BaseInstructorDto } from './base.instructor.dto'

export class CreateInstructorDto extends PickType(BaseInstructorDto, ['name', 'phone', 'dateOfBirth', 'email', 'idCardPhoto']) {}
