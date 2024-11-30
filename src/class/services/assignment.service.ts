import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import * as moment from 'moment-timezone'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Assignment } from '@src/class/schemas/assignment.schema'
import { Types } from 'mongoose'
import { UpdateAssignmentDto } from '@class/dto/assignment.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { Session } from '@class/schemas/session.schema'
import { VN_TIMEZONE } from '@src/config'

export const IAssignmentService = Symbol('IAssignmentService')

export interface IAssignmentService {
  findOneBy(params: { assignmentId: string; classId: string; instructorId?: string }): Promise<Assignment>
  findMyAssignment(params: { assignmentId: string; classId: string; learnerId: string }): Promise<Assignment>
  updateAssignment(params: {
    assignmentId: string
    classId: string
    instructorId?: string
    updateAssignmentDto: UpdateAssignmentDto
  }): Promise<void>
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
          select: ['learnerId'],
          match: {
            learnerId: new Types.ObjectId(learnerId)
          }
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

  async updateAssignment(params: {
    assignmentId: string
    classId: string
    instructorId?: string
    updateAssignmentDto: UpdateAssignmentDto
  }): Promise<void> {
    const { assignmentId, classId, instructorId, updateAssignmentDto } = params

    const conditions = { _id: classId }
    if (instructorId) conditions['instructorId'] = new Types.ObjectId(instructorId)

    const courseClass = await this.classRepository.findOne({
      conditions,
      projection: '+sessions',
      options: { lean: true }
    })

    let assignment: Assignment
    let classSession: Session
    for (let session of courseClass.sessions) {
      assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId)
      classSession = session
      if (assignment !== undefined) break
    }
    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)

    const { deadline } = updateAssignmentDto
    const { startDate, duration, weekdays } = courseClass
    const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date')

    const classDates = [] as Date[]
    let currentDate = startOfDate.clone()
    while (currentDate.isSameOrBefore(endOfDate)) {
      for (let weekday of weekdays) {
        const classDate = currentDate.clone().isoWeekday(weekday)
        if (classDate.isSameOrAfter(startOfDate) && classDate.isBefore(endOfDate)) {
          classDates.push(classDate.toDate())
        }
      }
      currentDate.add(1, 'week')
    }
    const classEndOfDate = moment(classDates[classDates.length - 1])
      .tz(VN_TIMEZONE)
      .endOf('date')
    const sessionStartDate = moment(classDates[classSession.sessionNumber - 1])
      .tz(VN_TIMEZONE)
      .startOf('date')

    const nowMoment = moment().tz(VN_TIMEZONE)
    const assignmentDeadline = moment(deadline).tz(VN_TIMEZONE).endOf('date')
    if (assignmentDeadline.isBefore(nowMoment) || assignmentDeadline.isAfter(classEndOfDate) || assignmentDeadline.isBefore(sessionStartDate))
      throw new AppException(Errors.ASSIGNMENT_DEADLINE_INVALID)

    classSession.assignments = classSession.assignments.map((assignment) => {
      if (assignment._id.toString() === assignmentId) {
        return { ...assignment, deadline: assignmentDeadline.toDate() }
      }
      return assignment
    })

    await this.classRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(classId) },
      {
        $set: {
          'sessions.$[i].assignments': classSession.assignments
        }
      },
      {
        arrayFilters: [
          {
            'i._id': new Types.ObjectId(classSession._id)
          }
        ]
      }
    )
  }
}
