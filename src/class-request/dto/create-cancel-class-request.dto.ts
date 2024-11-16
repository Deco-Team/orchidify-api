import { PickType } from '@nestjs/swagger'
import { BaseClassRequestDto } from './base.class-request.dto'

export class CreateCancelClassRequestDto extends PickType(BaseClassRequestDto, ['description', 'classId']) {}
