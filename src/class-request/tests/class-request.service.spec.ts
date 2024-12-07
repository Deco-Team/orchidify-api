import { IClassRequestRepository } from '@class-request/repositories/class-request.repository'
import { ClassRequestDocument } from '@class-request/schemas/class-request.schema'
import { ClassRequestService } from '@class-request/services/class-request.service'
import { ClassDocument } from '@class/schemas/class.schema'
import { IClassService } from '@class/services/class.service'
import { ClassRequestStatus, ClassRequestType, CourseStatus, UserRole } from '@common/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'
import { CourseDocument } from '@course/schemas/course.schema'
import { ICourseService } from '@course/services/course.service'
import { getConnectionToken } from '@nestjs/mongoose'
import { IQueueProducerService } from '@queue/services/queue-producer.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { ClientSession, Connection, Types } from 'mongoose'

describe('ClassRequestService', () => {
  let classRequestService: ClassRequestService
  let classService: Mocked<IClassService>
  let courseService: Mocked<ICourseService>
  let queueProducerService: Mocked<IQueueProducerService>
  let classRequestRepository: Mocked<IClassRequestRepository>
  let connection: Mocked<Connection>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ClassRequestService).compile()

    classRequestService = unit
    classService = unitRef.get(IClassService)
    courseService = unitRef.get(ICourseService)
    queueProducerService = unitRef.get(IQueueProducerService)
    classRequestRepository = unitRef.get(IClassRequestRepository)
    connection = unitRef.get(getConnectionToken())
  })

  describe('findManyByStatus', () => {
    it('should return class request list', async () => {
      const status = [ClassRequestStatus.APPROVED]

      classRequestRepository.findMany.mockResolvedValue([])

      const result = await classRequestService.findManyByStatus(status)

      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('findManyByCreatedByAndStatus', () => {
    it('should return class request list', async () => {
      const status = [ClassRequestStatus.APPROVED]
      const userId = new Types.ObjectId().toString()

      classRequestRepository.findMany.mockResolvedValue([])

      const result = await classRequestService.findManyByCreatedByAndStatus(userId, status)

      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('cancelClassRequest', () => {
    it('should throw if course not found', async () => {
      let instructorId = new Types.ObjectId()
      classRequestRepository.findOne.mockResolvedValue({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        classId: new Types.ObjectId(),
        createdBy: instructorId
      } as ClassRequestDocument)
      courseService.findById.mockResolvedValue(null)

      await expect(
        classRequestService.cancelClassRequest('1', { _id: instructorId.toString(), role: UserRole.INSTRUCTOR })
      ).rejects.toThrow(AppException)
    })

    it('should throw if course status invalid', async () => {
      let instructorId = new Types.ObjectId()
      classRequestRepository.findOne.mockResolvedValue({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        createdBy: instructorId
      } as ClassRequestDocument)
      courseService.findById.mockResolvedValue({ status: CourseStatus.DELETED, instructorId } as CourseDocument)

      await expect(
        classRequestService.cancelClassRequest('1', { _id: instructorId.toString(), role: UserRole.INSTRUCTOR })
      ).rejects.toThrow(AppException)
    })

    it('should cancel cancel class request', async () => {
      let instructorId = new Types.ObjectId()
      connection.startSession.mockResolvedValue({
        withTransaction: (cb) => {
          cb(this)
        },
        endSession: () => {}
      } as ClientSession)
      classRequestRepository.findOne.mockResolvedValue({
        _id: '1',
        type: ClassRequestType.CANCEL_CLASS,
        status: ClassRequestStatus.PENDING,
        classId: new Types.ObjectId(),
        createdBy: instructorId
      } as ClassRequestDocument)
      classService.findById.mockResolvedValue({ _id: '1', instructorId } as ClassDocument)

      const result = await classRequestService.cancelClassRequest('1', {
        _id: instructorId.toString(),
        role: UserRole.INSTRUCTOR
      })

      expect(result).toBeInstanceOf(Object)
      expect(result.success).toBe(true)
    })
  })
})
