import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { AssignmentSubmission, AssignmentSubmissionDocument } from '@src/class/schemas/assignment-submission.schema'
import { FilterQuery, PopulateOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateAssignmentSubmissionDto } from '@class/dto/assignment-submission.dto'
import { IAssignmentSubmissionRepository } from '@class/repositories/assignment-submission.repository'
import { SubmissionStatus } from '@common/contracts/constant'
import { ILearnerClassRepository } from '@class/repositories/learner-class.repository'
import { QueryOptions } from 'mongoose'

export const IAssignmentSubmissionService = Symbol('IAssignmentSubmissionService')

export interface IAssignmentSubmissionService {
  create(
    createAssignmentSubmissionDto: CreateAssignmentSubmissionDto,
    options?: SaveOptions | undefined
  ): Promise<AssignmentSubmission>
  update(
    conditions: FilterQuery<AssignmentSubmission>,
    payload: UpdateQuery<AssignmentSubmission>,
    options?: QueryOptions | undefined
  ): Promise<AssignmentSubmission>
  findById(
    classId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<AssignmentSubmission>
  findMyAssignmentSubmission(params: { assignmentId: string; learnerId: string }): Promise<AssignmentSubmission>
  list(querySubmissionDto: { classId: string; assignmentId: string })
  findMany(
    conditions: FilterQuery<AssignmentSubmissionDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<AssignmentSubmission[]>
}

@Injectable()
export class AssignmentSubmissionService implements IAssignmentSubmissionService {
  constructor(
    @Inject(IAssignmentSubmissionRepository)
    private readonly assignmentSubmissionRepository: IAssignmentSubmissionRepository,
    @Inject(ILearnerClassRepository)
    private readonly learnerClassRepository: ILearnerClassRepository
  ) {}

  public async create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, options?: SaveOptions | undefined) {
    const { assignmentId, learnerId, classId } = createAssignmentSubmissionDto

    const assignmentSubmission = await this.assignmentSubmissionRepository.create(
      {
        ...createAssignmentSubmissionDto,
        assignmentId: new Types.ObjectId(assignmentId),
        learnerId: new Types.ObjectId(learnerId),
        classId: new Types.ObjectId(classId),
        status: SubmissionStatus.SUBMITTED
      },
      options
    )
    return assignmentSubmission
  }

  public update(
    conditions: FilterQuery<AssignmentSubmission>,
    payload: UpdateQuery<AssignmentSubmission>,
    options?: QueryOptions | undefined
  ) {
    return this.assignmentSubmissionRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findById(
    submissionId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const submission = await this.assignmentSubmissionRepository.findOne({
      conditions: {
        _id: submissionId
      },
      projection,
      populates
    })
    return submission
  }

  public async findMyAssignmentSubmission(params: { assignmentId: string; learnerId: string }) {
    const { assignmentId, learnerId } = params

    const assignmentSubmission = await this.assignmentSubmissionRepository.findOne({
      conditions: {
        assignmentId: new Types.ObjectId(assignmentId),
        learnerId: new Types.ObjectId(learnerId)
      }
    })

    return assignmentSubmission
  }

  async list(querySubmissionDto: { classId: string; assignmentId: string }) {
    const { classId, assignmentId } = querySubmissionDto
    const submissions = await this.learnerClassRepository.model.aggregate([
      {
        $match: {
          classId: new Types.ObjectId(classId)
        }
      },
      {
        $project: {
          learnerId: 1,
          classId: 1
        }
      },
      {
        $lookup: {
          from: 'assignment-submissions',
          localField: 'classId',
          foreignField: 'classId',
          as: 'submissions',
          let: {
            learnerId: '$learnerId',
            classId: '$classId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$learnerId', '$$learnerId']
                    },
                    {
                      $eq: ['$classId', '$$classId']
                    },
                    {
                      $eq: ['$assignmentId', new Types.ObjectId(assignmentId)]
                    }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'learners',
          localField: 'learnerId',
          foreignField: '_id',
          as: 'learners',
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
              }
            }
          ]
        }
      },
      {
        $addFields: {
          learner: {
            $arrayElemAt: ['$learners', 0]
          },
          submission: {
            $arrayElemAt: ['$submissions', 0]
          }
        }
      },
      {
        $project: {
          submissions: 0,
          learners: 0
        }
      }
    ])
    return { docs: submissions }
  }

  public async findMany(
    conditions: FilterQuery<AssignmentSubmissionDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const submissions = await this.assignmentSubmissionRepository.findMany({
      conditions,
      projection,
      populates
    })
    return submissions
  }
}
