import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { ILearnerClassRepository } from '@src/class/repositories/learner-class.repository'
import { LearnerClass, LearnerClassDocument } from '@src/class/schemas/learner-class.schema'
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'

export const ILearnerClassService = Symbol('ILearnerClassService')

export interface ILearnerClassService {
  create(createLearnerClassDto: any, options?: SaveOptions | undefined): Promise<LearnerClassDocument>
  findById(
    learnerClassId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<LearnerClassDocument>
  update(
    conditions: FilterQuery<LearnerClass>,
    payload: UpdateQuery<LearnerClass>,
    options?: QueryOptions | undefined
  ): Promise<LearnerClassDocument>
  findOneBy(
    conditions: FilterQuery<LearnerClass>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<LearnerClassDocument>
  findMany(
    conditions: FilterQuery<LearnerClassDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<LearnerClassDocument[]>
}

@Injectable()
export class LearnerClassService implements ILearnerClassService {
  constructor(
    @Inject(ILearnerClassRepository)
    private readonly classRepository: ILearnerClassRepository,
    @InjectConnection() readonly connection: Connection
  ) {}

  public async create(createLearnerClassDto: any, options?: SaveOptions | undefined) {
    const learnerClass = await this.classRepository.create(createLearnerClassDto, options)
    return learnerClass
  }

  public async findById(
    learnerClassId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const learnerClass = await this.classRepository.findOne({
      conditions: {
        _id: learnerClassId
      },
      projection,
      populates
    })
    return learnerClass
  }

  public async findOneBy(
    conditions: FilterQuery<LearnerClassDocument>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const learnerClass = await this.classRepository.findOne({
      conditions,
      projection,
      populates
    })
    return learnerClass
  }

  public async findMany(
    conditions: FilterQuery<LearnerClassDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const learnerClasses = await this.classRepository.findMany({
      conditions,
      projection,
      populates
    })
    return learnerClasses
  }

  public update(
    conditions: FilterQuery<LearnerClass>,
    payload: UpdateQuery<LearnerClass>,
    options?: QueryOptions | undefined
  ) {
    return this.classRepository.findOneAndUpdate(conditions, payload, options)
  }
}
