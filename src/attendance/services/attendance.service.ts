import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IAttendanceRepository } from '@attendance/repositories/attendance.repository'
import { Attendance, AttendanceDocument } from '@attendance/schemas/attendance.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { TakeAttendanceDto } from '@attendance/dto/take-attendance.dto'
import { QueryAttendanceDto } from '@attendance/dto/view-attendance.dto'
import { ATTENDANCE_LIST_PROJECTION } from '@attendance/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'

export const IAttendanceService = Symbol('IAttendanceService')

export interface IAttendanceService {
  create(takeAttendanceDto: TakeAttendanceDto, options?: SaveOptions | undefined): Promise<AttendanceDocument>
  findById(
    attendanceId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<AttendanceDocument>
  findOneBy(
    conditions: FilterQuery<Attendance>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<AttendanceDocument>
  findMany(
    conditions: FilterQuery<AttendanceDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<AttendanceDocument[]>
  update(
    conditions: FilterQuery<Attendance>,
    payload: UpdateQuery<Attendance>,
    options?: QueryOptions | undefined
  ): Promise<AttendanceDocument>
  list(
    queryAttendanceDto: QueryAttendanceDto,
    projection?: string | Record<string, any>,
    populate?: Array<PopulateOptions>
  )
  bulkWrite(slotId: string, takeAttendanceDto: TakeAttendanceDto[])
}

@Injectable()
export class AttendanceService implements IAttendanceService {
  private readonly appLogger = new AppLogger(AttendanceService.name)
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository
  ) {}

  public async create(takeAttendanceDto: TakeAttendanceDto, options?: SaveOptions | undefined) {
    return await this.attendanceRepository.create({ ...takeAttendanceDto }, options)
  }

  public async update(
    conditions: FilterQuery<Attendance>,
    payload: UpdateQuery<Attendance>,
    options?: QueryOptions | undefined
  ) {
    return await this.attendanceRepository.findOneAndUpdate(conditions, payload, options)
  }

  bulkWrite(slotId: string, takeAttendanceDto: TakeAttendanceDto[]) {
    const operations = []
    for (const attendance of takeAttendanceDto) {
      operations.push({
        updateOne: {
          filter: { learnerId: new Types.ObjectId(attendance.learnerId), slotId: new Types.ObjectId(slotId) },
          update: {
            $set: { ...attendance, learnerId: new Types.ObjectId(attendance.learnerId) }
          },
          upsert: true
        }
      })
    }
    return this.attendanceRepository.model.bulkWrite(operations)
  }

  public async findById(
    attendanceId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const attendance = await this.attendanceRepository.findOne({
      conditions: {
        _id: attendanceId
      },
      projection,
      populates
    })
    return attendance
  }

  public async findOneBy(
    conditions: FilterQuery<Attendance>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const attendance = await this.attendanceRepository.findOne({
      conditions,
      projection,
      populates
    })
    return attendance
  }

  public async findMany(
    conditions: FilterQuery<AttendanceDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const attendances = await this.attendanceRepository.findMany({
      conditions,
      projection,
      populates
    })
    return attendances
  }

  async list(
    queryCourseDto: QueryAttendanceDto,
    projection = ATTENDANCE_LIST_PROJECTION,
    populate?: Array<PopulateOptions>
  ) {
    const { slotId } = queryCourseDto
    const filter: Record<string, any> = {}
    if (slotId) {
      filter['slotId'] = slotId
    }

    // const validStatus = status?.filter((status) =>
    //   [AttendanceStatus.ACTIVE, AttendanceStatus.INACTIVE].includes(status)
    // )
    // if (validStatus?.length > 0) {
    //   filter['status'] = {
    //     $in: validStatus
    //   }
    // }

    return this.attendanceRepository.model.paginate(filter, {
      // ...pagination,
      projection,
      populate
    })
  }
}
