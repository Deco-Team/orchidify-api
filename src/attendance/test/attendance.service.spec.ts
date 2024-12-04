import { TakeAttendanceDto } from '@attendance/dto/take-attendance.dto'
import { QueryAttendanceDto } from '@attendance/dto/view-attendance.dto'
import { IAttendanceRepository } from '@attendance/repositories/attendance.repository'
import { AttendanceDocument } from '@attendance/schemas/attendance.schema'
import { AttendanceService } from '@attendance/services/attendance.service'
import { AttendanceStatus } from '@common/contracts/constant'
import { Mocked, TestBed } from '@suites/unit'
import { PaginateResult, Types } from 'mongoose'

describe('AttendanceService', () => {
  let attendanceService: AttendanceService
  let attendanceRepository: Mocked<IAttendanceRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AttendanceService).compile()

    attendanceService = unit
    attendanceRepository = unitRef.get(IAttendanceRepository)
  })

  describe('create', () => {
    it('should create attendance', async () => {
      const takeAttendanceDto: TakeAttendanceDto = {
        learnerId: new Types.ObjectId().toString(),
        status: AttendanceStatus.PRESENT,
        note: 'note'
      }

      attendanceRepository.create.mockResolvedValue({
        _id: 'attendanceId',
        learnerId: new Types.ObjectId(takeAttendanceDto.learnerId),
        status: takeAttendanceDto.status,
        note: takeAttendanceDto.note
      } as AttendanceDocument)

      const attendance = await attendanceService.create(takeAttendanceDto)
      expect(attendance).toBeDefined()
    })
  })

  describe('update', () => {
    it('should update attendance', async () => {
      const conditions = {
        _id: new Types.ObjectId().toString()
      }
      const payload = {
        status: AttendanceStatus.PRESENT,
        note: 'note'
      }

      attendanceRepository.findOneAndUpdate.mockResolvedValue({
        _id: conditions._id,
        status: payload.status,
        note: payload.note
      } as AttendanceDocument)

      const attendance = await attendanceService.update(conditions, payload)
      expect(attendance).toBeDefined()
    })
  })

  describe('findById', () => {
    it('should find attendance by id', async () => {
      const attendanceId = new Types.ObjectId().toString()

      attendanceRepository.findOne.mockResolvedValue({
        _id: attendanceId
      } as AttendanceDocument)

      const attendance = await attendanceService.findById(attendanceId)
      expect(attendance).toBeDefined()
    })
  })

  describe('findOneBy', () => {
    it('should find attendance by conditions', async () => {
      const conditions = {
        _id: new Types.ObjectId().toString()
      }

      attendanceRepository.findOne.mockResolvedValue({
        _id: conditions._id
      } as AttendanceDocument)

      const attendance = await attendanceService.findOneBy(conditions)
      expect(attendance).toBeDefined()
    })
  })

  describe('list', () => {
    it('should list attendance', async () => {
      const conditions: QueryAttendanceDto = {
        slotId: new Types.ObjectId()
      }

      attendanceRepository.model.paginate.mockResolvedValue({
        docs: [
          {
            _id: new Types.ObjectId()
          } as any
        ],
        totalDocs: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
        totalPages: 1,
        offset: 0,
        pagingCounter: 1
      })

      const attendances = await attendanceService.list(conditions)
      expect(attendances).toBeDefined()
    })
  })
})
