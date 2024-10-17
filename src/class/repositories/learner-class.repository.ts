import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { LearnerClass, LearnerClassDocument } from '@src/class/schemas/learner-class.schema'
import { AbstractRepository } from '@common/repositories'

export const ILearnerClassRepository = Symbol('ILearnerClassRepository')

export interface ILearnerClassRepository extends AbstractRepository<LearnerClassDocument> {}

@Injectable()
export class LearnerClassRepository extends AbstractRepository<LearnerClassDocument> implements ILearnerClassRepository {
  constructor(@InjectModel(LearnerClass.name) model: PaginateModel<LearnerClassDocument>) {
    super(model)
  }
}
