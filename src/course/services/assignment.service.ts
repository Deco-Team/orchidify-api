import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Assignment } from '@course/schemas/assignment.schema'
import { Types } from 'mongoose'

export const IAssignmentService = Symbol('IAssignmentService')

export interface IAssignmentService {
  findOneBy(params: { assignmentId: string; courseId: string; instructorId?: string }): Promise<Assignment>
}

@Injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async findOneBy(params: { assignmentId: string; courseId: string; instructorId?: string }) {
    const { assignmentId, courseId, instructorId } = params
    const course = await this.courseRepository.findOne({
      conditions: {
        _id: courseId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'assignments'
    })
    return course?.assignments?.find((Assignment) => Assignment._id.toString() === assignmentId)
  }
}
