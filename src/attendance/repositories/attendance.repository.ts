import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Attendance, AttendanceDocument } from '@attendance/schemas/attendance.schema'
import { AbstractRepository } from '@common/repositories'

export const IAttendanceRepository = Symbol('IAttendanceRepository')

export interface IAttendanceRepository extends AbstractRepository<AttendanceDocument> {}

@Injectable()
export class AttendanceRepository extends AbstractRepository<AttendanceDocument> implements IAttendanceRepository {
  constructor(@InjectModel(Attendance.name) model: PaginateModel<AttendanceDocument>) {
    super(model)
  }
}
