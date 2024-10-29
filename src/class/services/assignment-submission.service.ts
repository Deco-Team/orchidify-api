import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { AssignmentSubmission } from '@src/class/schemas/assignment-submission.schema'
import { SaveOptions, Types } from 'mongoose'
import { CreateAssignmentSubmissionDto } from '@class/dto/assignment-submission.dto'
import { IAssignmentSubmissionRepository } from '@class/repositories/assignment-submission.repository'
import { SubmissionStatus } from '@common/contracts/constant'

export const IAssignmentSubmissionService = Symbol('IAssignmentSubmissionService')

export interface IAssignmentSubmissionService {
  create(
    createAssignmentSubmissionDto: CreateAssignmentSubmissionDto,
    options?: SaveOptions | undefined
  ): Promise<AssignmentSubmission>
  findMyAssignmentSubmission(params: { assignmentId: string; learnerId: string }): Promise<AssignmentSubmission>
}

@Injectable()
export class AssignmentSubmissionService implements IAssignmentSubmissionService {
  constructor(
    @Inject(IAssignmentSubmissionRepository)
    private readonly assignmentSubmissionRepository: IAssignmentSubmissionRepository
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
}
