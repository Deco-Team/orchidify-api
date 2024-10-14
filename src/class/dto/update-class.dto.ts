import { PartialType, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'

export class UpdateClassDto extends PartialType(
  PickType(BaseClassDto, [
    'title',
    'description',
    'price',
    'level',
    'type',
    'thumbnail',
    'media',
    'learnerLimit',
    'sessions',
  ])
) {}
