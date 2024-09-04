import { IAuthUserService } from '@auth/services/auth.service'
import { Injectable, Inject } from '@nestjs/common'
import { ILearnerRepository } from '@src/learner/repositories/learner.repository'
import { Learner } from '@src/learner/schemas/learner.schema'
import { SaveOptions } from 'mongoose'

export const ILearnerService = Symbol('ILearnerService')

export interface ILearnerService extends IAuthUserService {
  create(learner: any, options?: SaveOptions | undefined): Promise<Learner>
  findById(learnerId: string): Promise<Learner>
}

@Injectable()
export class LearnerService implements ILearnerService {
  constructor(
    @Inject(ILearnerRepository)
    private readonly learnerRepository: ILearnerRepository
  ) {}

  public create(learner: any, options?: SaveOptions | undefined): Promise<Learner> {
    return this.learnerRepository.create(learner, options)
  }

  public async findById(learnerId: string): Promise<Learner> {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        _id: learnerId
      },
      projection: '-password'
    })
    return learner
  }

  public async findByEmail(email: string, projection: string | Record<string, any>): Promise<Learner> {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return learner
  }
}
