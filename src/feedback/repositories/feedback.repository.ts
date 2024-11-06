import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Feedback, FeedbackDocument } from '@feedback/schemas/feedback.schema'
import { AbstractRepository } from '@common/repositories'

export const IFeedbackRepository = Symbol('IFeedbackRepository')

export interface IFeedbackRepository extends AbstractRepository<FeedbackDocument> {}

@Injectable()
export class FeedbackRepository extends AbstractRepository<FeedbackDocument> implements IFeedbackRepository {
  constructor(@InjectModel(Feedback.name) model: PaginateModel<FeedbackDocument>) {
    super(model)
  }
}
