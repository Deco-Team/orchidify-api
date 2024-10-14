import { PartialType, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'

export class UpdateCourseDto extends PartialType(
  PickType(BaseCourseDto, [
    'title',
    'description',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'learnerLimit',
    'sessions',
    'gardenRequiredToolkits'
  ])
) {}
