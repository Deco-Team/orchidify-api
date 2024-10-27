import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Assignment } from '@src/class/schemas/assignment.schema'
import { Types } from 'mongoose'

export const IAssignmentService = Symbol('IAssignmentService')

export interface IAssignmentService {
  findOneBy(params: { assignmentId: string; classId: string; instructorId?: string }): Promise<Assignment>
  findMyAssignment(params: { assignmentId: string; classId: string; learnerId: string }): Promise<Assignment>
}

@Injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository
  ) {}

  public async findOneBy(params: { assignmentId: string; classId: string; instructorId?: string }) {
    const { assignmentId, classId, instructorId } = params

    const conditions = { _id: classId }
    if (instructorId) conditions['instructorId'] = new Types.ObjectId(instructorId)

    const courseClass = await this.classRepository.findOne({
      conditions,
      projection: 'sessions',
      options: { lean: true }
    })
    
    let assignment: Assignment
    for (let session of courseClass.sessions) {
      assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId)
      if (assignment) {
        assignment['sessionNumber'] = session.sessionNumber
        break
      }
    }
    if (!assignment) return null

    return assignment
  }

  public async findMyAssignment(params: { assignmentId: string; classId: string; learnerId: string }) {
    const { assignmentId, classId, learnerId } = params

    const conditions = { _id: classId }

    const courseClass = await this.classRepository.findOne({
      conditions,
      projection: 'sessions',
      populates: [
        {
          path: 'learnerClass',
          select: ['learnerId']
        }
      ],
      options: { lean: true }
    })
    if ((_.get(courseClass, 'learnerClass.learnerId') as string)?.toString() !== learnerId) return null

    let assignment: Assignment
    for (let session of courseClass.sessions) {
      assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId)
      if (assignment) {
        assignment['sessionNumber'] = session.sessionNumber
        break
      }
    }
    if (!assignment) return null

    return assignment
  }
}
