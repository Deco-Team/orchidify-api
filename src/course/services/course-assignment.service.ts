import { Injectable, Inject } from '@nestjs/common'
import { Assignment } from '@src/class/schemas/assignment.schema'
import { Types } from 'mongoose'
import { ICourseRepository } from '@course/repositories/course.repository'

export const ICourseAssignmentService = Symbol('ICourseAssignmentService')

export interface ICourseAssignmentService {
  findOneBy(params: { assignmentId: string; courseId: string; instructorId?: string }): Promise<Assignment>
}

@Injectable()
export class CourseAssignmentService implements ICourseAssignmentService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async findOneBy(params: { assignmentId: string; courseId: string; instructorId?: string }) {
    const { assignmentId, courseId, instructorId } = params
    const conditions = { _id: courseId }
    if (instructorId) conditions['instructorId'] = new Types.ObjectId(instructorId)

    const course = await this.courseRepository.findOne({
      conditions,
      projection: 'sessions',
      options: { lean: true }
    })

    let assignment: Assignment
    for (let session of course.sessions) {
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
