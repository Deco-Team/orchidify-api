import { getConnectionToken } from '@nestjs/mongoose'
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto'
import { ClassDocument } from '@class/schemas/class.schema'
import { IClassService } from '@class/services/class.service'
import { CourseDocument } from '@course/schemas/course.schema'
import { ICourseService } from '@course/services/course.service'
import { SendFeedbackDto } from '@feedback/dto/send-feedback.dto'
import { IFeedbackRepository } from '@feedback/repositories/feedback.repository'
import { FeedbackDocument } from '@feedback/schemas/feedback.schema'
import { FeedbackService } from '@feedback/services/feedback.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { ClientSession, Connection, Types } from 'mongoose'
import { SuccessResponse } from '@common/contracts/dto'

describe('FeedbackService', () => {
  let feedbackService: FeedbackService
  let classService: Mocked<IClassService>
  let courseService: Mocked<ICourseService>
  let feedbackRepository: Mocked<IFeedbackRepository>
  let connection: Mocked<Connection>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(FeedbackService).compile()

    feedbackService = unit
    classService = unitRef.get(IClassService)
    courseService = unitRef.get(ICourseService)
    feedbackRepository = unitRef.get(IFeedbackRepository)
    connection = unitRef.get(getConnectionToken())
  })

  describe('sendFeedback', () => {
    it('should send feedback successfully', async () => {
      const sendFeedbackDto = {
        classId: new Types.ObjectId(),
        courseId: new Types.ObjectId(),
        rate: 5
      }
      const classRatingSummaryDto = {
        totalSum: 5,
        totalCount: 1,
        totalCountByRate: {
          '5': 1
        }
      }
      const courseRatingSummaryDto = {
        totalSum: 5,
        totalCount: 1,
        totalCountByRate: {
          '5': 1
        }
      }

      feedbackRepository.create.mockResolvedValue({} as FeedbackDocument)
      classService.update.mockResolvedValue({} as ClassDocument)
      courseService.update.mockResolvedValue({} as CourseDocument)
      connection.startSession.mockResolvedValue({
        withTransaction: (cb) => {
          cb(this)
        },
        endSession: () => {}
      } as ClientSession)

      const result = await feedbackService.sendFeedback(
        sendFeedbackDto as SendFeedbackDto,
        classRatingSummaryDto as BaseRatingSummaryDto,
        courseRatingSummaryDto as BaseRatingSummaryDto
      )

      expect(result).toMatchObject(new SuccessResponse(true))
    })
  })

  describe('update', () => {
    it('should update feedback successfully', async () => {
      const feedbackId = new Types.ObjectId()
      const updateFeedbackDto = {
        rate: 5,
        comment: 'Great course'
      }

      feedbackRepository.findOneAndUpdate.mockResolvedValue({} as FeedbackDocument)

      const result = await feedbackService.update(feedbackId, updateFeedbackDto)

      expect(result).toMatchObject({})
    })
  })

  describe('findById', () => {
    it('should return the feedback', async () => {
      const feedbackId = new Types.ObjectId().toString()
      feedbackRepository.findOne.mockResolvedValue({} as FeedbackDocument)

      const result = await feedbackService.findById(feedbackId)

      expect(result).toMatchObject({})
    })
  })

  describe('list', () => {
    it('should return the feedback list', async () => {
      feedbackRepository.model.paginate.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        limit: 10,
        hasPrevPage: false,
        hasNextPage: false,
        totalPages: 0,
        offset: 0,
        pagingCounter: 0
      })

      const result = await feedbackService.list(
        { page: 1, limit: 10, sort: new Map() },
        { rate: 5, courseId: new Types.ObjectId() }
      )

      expect(result).toMatchObject({
        docs: [],
        totalDocs: 0,
        limit: 10,
        hasPrevPage: false,
        hasNextPage: false,
        totalPages: 0,
        offset: 0,
        pagingCounter: 0
      })
    })
  })
})
