import { Injectable, Inject } from '@nestjs/common'
import { Session } from '@class/schemas/session.schema'
import { Types } from 'mongoose'
import { ICourseRepository } from '@course/repositories/course.repository'

export const ICourseSessionService = Symbol('ICourseSessionService')

export interface ICourseSessionService {
  findOneBy(params: { sessionId: string; courseId: string; instructorId?: string }): Promise<Session>
}

@Injectable()
export class CourseSessionService implements ICourseSessionService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async findOneBy(params: { sessionId: string; courseId: string; instructorId?: string }) {
    const { sessionId, courseId, instructorId } = params
    const conditions = { _id: courseId }
    if (instructorId) conditions['instructorId'] = new Types.ObjectId(instructorId)

    const course = await this.courseRepository.findOne({
      conditions,
      projection: 'sessions',
      options: { lean: true }
    })

    const sessionIndex = course?.sessions?.findIndex((session) => session._id.toString() === sessionId)
    if (sessionIndex === -1) return null

    return course?.sessions[sessionIndex]
  }
}
