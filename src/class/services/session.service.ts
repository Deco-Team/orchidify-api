import { Injectable, Inject } from '@nestjs/common'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Session } from '@class/schemas/session.schema'
import { Types } from 'mongoose'

export const ISessionService = Symbol('ISessionService')

export interface ISessionService {
  findOneBy(params: { sessionId: string; classId: string; instructorId?: string }): Promise<Session>
}

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository
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
}
