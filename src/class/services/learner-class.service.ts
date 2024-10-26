import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { ILearnerClassRepository } from '@src/class/repositories/learner-class.repository'
import { LearnerClass, LearnerClassDocument } from '@src/class/schemas/learner-class.schema'
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { QueryClassDto } from '@class/dto/view-class.dto'
import { ClassStatus, CourseLevel } from '@common/contracts/constant'
import { LEARNER_VIEW_MY_CLASS_LIST_PROJECTION } from '@class/contracts/constant'
import { HelperService } from '@common/services/helper.service'
import { IClassRepository } from '@class/repositories/class.repository'

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
  listMyClassesByLearner(learnerId: string, pagination: PaginationParams, queryClassDto: QueryClassDto)
}

@Injectable()
export class LearnerClassService implements ILearnerClassService {
  constructor(
    @Inject(ILearnerClassRepository)
    private readonly learnerClassRepository: ILearnerClassRepository,
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    @InjectConnection() readonly connection: Connection,
    private readonly helperService: HelperService
  ) {}

  public async create(createLearnerClassDto: any, options?: SaveOptions | undefined) {
    const learnerClass = await this.learnerClassRepository.create(createLearnerClassDto, options)
    return learnerClass
  }

  public async findById(
    learnerClassId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const learnerClass = await this.learnerClassRepository.findOne({
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
    const learnerClass = await this.learnerClassRepository.findOne({
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
    const learnerClasses = await this.learnerClassRepository.findMany({
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
    return this.learnerClassRepository.findOneAndUpdate(conditions, payload, options)
  }

  async listMyClassesByLearner(
    learnerId: string,
    pagination: PaginationParams,
    queryClassDto: QueryClassDto,
    projection = LEARNER_VIEW_MY_CLASS_LIST_PROJECTION
  ) {
    const { title, type, level, status } = queryClassDto
    const { sort, limit, page } = pagination
    const learnerClassFilter: Record<string, any> = {
      learnerId: new Types.ObjectId(learnerId)
    }
    const classFilter: Record<string, any> = {}

    let textSearch = ''
    if (title) textSearch += title.trim()
    if (type) textSearch += ' ' + type.trim()
    if (textSearch) {
      classFilter['$text'] = {
        $search: textSearch.trim()
      }
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      classFilter['level'] = {
        $in: validLevel
      }
    }

    const validStatus = status?.filter((status) =>
      [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED].includes(status)
    )
    if (validStatus?.length > 0) {
      classFilter['status'] = {
        $in: validStatus
      }
    }

    const classes = await this.classRepository.model.aggregate([
      {
        $match: classFilter
      },
      {
        $lookup: {
          from: 'learner-classes',
          localField: '_id',
          foreignField: 'classId',
          as: 'learnerClasses',
          pipeline: [
            {
              $match: learnerClassFilter
            }
          ]
        }
      },
      {
        $match: {
          learnerClasses: { $ne: [] }
        }
      },
      {
        $addFields: {
          learnerClass: {
            $arrayElemAt: ['$learnerClasses', 0]
          }
        }
      },
      {
        $project: {
          learnerClasses: 0
        }
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructors'
        }
      },
      {
        $addFields: {
          instructor: {
            $arrayElemAt: ['$instructors', 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          code: 1,
          title: 1,
          level: 1,
          type: 1,
          thumbnail: 1,
          status: 1,
          progress: 1,
          instructor: {
            name: 1
          }
        }
      },
      {
        $facet: {
          count: [
            {
              $count: 'totalDocs'
            }
          ],
          list: [
            {
              $sort: sort
            },
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ]
        }
      }
    ])
    const totalDocs = _.get(classes, '[0].count[0].totalDocs', 0)
    return this.helperService.convertDataToPaging({
      docs: classes[0].list,
      totalDocs,
      limit,
      page
    })
  }
}
