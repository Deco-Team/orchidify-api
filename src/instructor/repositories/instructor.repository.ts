import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Instructor, InstructorDocument } from '@instructor/schemas/instructor.schema'
import { AbstractRepository } from '@common/repositories'

export const IInstructorRepository = Symbol('IInstructorRepository')

export interface IInstructorRepository  extends AbstractRepository<InstructorDocument> {
}

@Injectable()
export class InstructorRepository extends AbstractRepository<InstructorDocument> implements IInstructorRepository {
  constructor(@InjectModel(Instructor.name) model: PaginateModel<InstructorDocument>) {
    super(model)
  }
}
