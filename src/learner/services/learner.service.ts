import { IAuthUserService } from '@auth/services/auth.service'
import { Injectable, Inject } from '@nestjs/common'
import { ILearnerRepository } from '@src/learner/repositories/learner.repository'
import { Learner, LearnerDocument } from '@src/learner/schemas/learner.schema'
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'

export const ILearnerService = Symbol('ILearnerService')

export interface ILearnerService extends IAuthUserService {
  create(learner: any, options?: SaveOptions | undefined): Promise<LearnerDocument>
  findById(learnerId: string): Promise<LearnerDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<LearnerDocument>
  update(conditions: FilterQuery<Learner>, payload: UpdateQuery<Learner>, options?: QueryOptions | undefined): Promise<LearnerDocument>
}

@Injectable()
export class LearnerService implements ILearnerService {
  constructor(
    @Inject(ILearnerRepository)
    private readonly learnerRepository: ILearnerRepository
  ) {}

  public create(learner: any, options?: SaveOptions | undefined) {
    return this.learnerRepository.create(learner, options)
  }

  public async findById(learnerId: string) {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        _id: learnerId
      },
      projection: '-password'
    })
    return learner
  }

  public async findByEmail(email: string, projection: string | Record<string, any>) {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return learner
  }

  public update(
    conditions: FilterQuery<Learner>,
    payload: UpdateQuery<Learner>,
    options?: QueryOptions | undefined
  ) {
    return this.learnerRepository.findOneAndUpdate(conditions, payload, options)
  }
}
