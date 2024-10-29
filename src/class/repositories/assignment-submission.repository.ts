import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AssignmentSubmission, AssignmentSubmissionDocument } from '@src/class/schemas/assignment-submission.schema'
import { AbstractRepository } from '@common/repositories'

export const IAssignmentSubmissionRepository = Symbol('IAssignmentSubmissionRepository')

export interface IAssignmentSubmissionRepository extends AbstractRepository<AssignmentSubmissionDocument> {}

@Injectable()
export class AssignmentSubmissionRepository extends AbstractRepository<AssignmentSubmissionDocument> implements IAssignmentSubmissionRepository {
  constructor(@InjectModel(AssignmentSubmission.name) model: PaginateModel<AssignmentSubmissionDocument>) {
    super(model)
  }
}
