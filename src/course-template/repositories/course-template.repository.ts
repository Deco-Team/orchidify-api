import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CourseTemplate, CourseTemplateDocument } from '@course-template/schemas/course-template.schema'
import { AbstractRepository } from '@common/repositories'

export const ICourseTemplateRepository = Symbol('ICourseTemplateRepository')

export interface ICourseTemplateRepository extends AbstractRepository<CourseTemplateDocument> {}

@Injectable()
export class CourseTemplateRepository extends AbstractRepository<CourseTemplateDocument> implements ICourseTemplateRepository {
  constructor(@InjectModel(CourseTemplate.name) model: PaginateModel<CourseTemplateDocument>) {
    super(model)
  }
}
