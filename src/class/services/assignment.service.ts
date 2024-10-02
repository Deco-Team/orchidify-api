import { Injectable, Inject } from '@nestjs/common'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Assignment } from '@src/class/schemas/assignment.schema'
import { Types } from 'mongoose'

export const IAssignmentService = Symbol('IAssignmentService')

export interface IAssignmentService {
  findOneBy(params: { assignmentId: string; classId: string; instructorId?: string }): Promise<Assignment>
}

@Injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository
  ) {}

  public async findOneBy(params: { assignmentId: string; classId: string; instructorId?: string }) {
    const { assignmentId, classId, instructorId } = params
    const courseClass = await this.classRepository.findOne({
      conditions: {
        _id: classId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'assignments',
      options: { lean: true }
    })
    const assignmentIndex = courseClass?.assignments?.findIndex((assignment) => assignment._id.toString() === assignmentId)
    if (assignmentIndex === -1) return null

    return { ...courseClass?.assignments[assignmentIndex], index: assignmentIndex }
  }
}
