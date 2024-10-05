import { PartialType, PickType } from '@nestjs/swagger'
import { BaseClassRequestDto } from './base.class-request.dto'

export class UpdateClassRequestDto extends PartialType(PickType(BaseClassRequestDto, ['type', 'description'])) {}
