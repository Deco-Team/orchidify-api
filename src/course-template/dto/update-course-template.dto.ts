import { PartialType, PickType } from '@nestjs/swagger'
import { BaseCourseTemplateDto } from './base.course-template.dto'

export class UpdateCourseTemplateDto extends PartialType(
  PickType(BaseCourseTemplateDto, [
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
