import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { AbstractRepository } from '@common/repositories'

export const ICourseRepository = Symbol('ICourseRepository')

export interface ICourseRepository extends AbstractRepository<CourseDocument> {}

@Injectable()
export class CourseRepository extends AbstractRepository<CourseDocument> implements ICourseRepository {
  constructor(@InjectModel(Course.name) model: PaginateModel<CourseDocument>) {
    super(model)
  }
}
