import { PartialType, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'

export class UpdateCourseDto extends PartialType(
  PickType(BaseCourseDto, [
    'title',
    'description',
    'price',
    'level',
    'type',
    'thumbnail',
    'media',
    'learnerLimit',
    'lessons',
    'assignments'
  ])
) {}
