import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Session } from '@class/schemas/session.schema'
import { Types } from 'mongoose'
import { ILearnerClassService } from './learner-class.service'

export const ISessionService = Symbol('ISessionService')

export interface ISessionService {
  findOneBy(params: { sessionId: string; classId: string; instructorId?: string }): Promise<Session>
  findMySession(params: { sessionId: string; classId: string; learnerId: string }): Promise<Session>
}

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
  ) {}

  public async findOneBy(params: { sessionId: string; classId: string; instructorId?: string }) {
    const { sessionId, classId, instructorId } = params
    const conditions = { _id: classId }
    if (instructorId) conditions['instructorId'] = new Types.ObjectId(instructorId)

    const courseClass = await this.classRepository.findOne({
      conditions,
      projection: 'sessions',
      options: { lean: true }
    })

    const sessionIndex = courseClass?.sessions.findIndex((session) => session._id.toString() === sessionId)
    if (sessionIndex === -1) return null

    return courseClass?.sessions[sessionIndex]
  }

  public async findMySession(params: { sessionId: string; classId: string; learnerId: string }) {
    const { sessionId, classId, learnerId } = params
    const conditions = { _id: classId }
    
    const courseClass = await this.classRepository.findOne({
      conditions,
      projection: 'sessions',
      populates: [
        {
          path: 'learnerClass',
          select: ['learnerId'],
          match: {
            learnerId: new Types.ObjectId(learnerId)
          }
        }
      ],
      options: { lean: true }
    })
    if ((_.get(courseClass, 'learnerClass.learnerId') as string)?.toString() !== learnerId) return null

    const sessionIndex = courseClass?.sessions.findIndex((session) => session._id.toString() === sessionId)
    if (sessionIndex === -1) return null

    return courseClass?.sessions[sessionIndex]
  }
}
