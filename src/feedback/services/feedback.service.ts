import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IFeedbackRepository } from '@feedback/repositories/feedback.repository'
import { Feedback, FeedbackDocument } from '@feedback/schemas/feedback.schema'
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { QueryFeedbackDto } from '@feedback/dto/view-feedback.dto'
import { FEEDBACK_LIST_PROJECTION } from '@feedback/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { SendFeedbackDto } from '@feedback/dto/send-feedback.dto'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { BaseRatingSummaryDto, BaseRatingTotalCountByRateDto } from '@class/dto/rating-summary.dto'
import { InjectConnection } from '@nestjs/mongoose'
import { SuccessResponse } from '@common/contracts/dto'
import { IClassService } from '@class/services/class.service'
import { ICourseService } from '@course/services/course.service'

export const IFeedbackService = Symbol('IFeedbackService')

export interface IFeedbackService {
  sendFeedback(
    sendFeedbackDto: SendFeedbackDto,
    classRatingSummary: BaseRatingSummaryDto,
    courseRatingSummary: BaseRatingSummaryDto
  ): Promise<SuccessResponse>
  create(sendFeedbackDto: SendFeedbackDto, options?: SaveOptions | undefined): Promise<FeedbackDocument>
  findById(
    feedbackId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<FeedbackDocument>
  findOneBy(
    conditions: FilterQuery<Feedback>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<FeedbackDocument>
  findMany(
    conditions: FilterQuery<FeedbackDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<FeedbackDocument[]>
  update(
    conditions: FilterQuery<Feedback>,
    payload: UpdateQuery<Feedback>,
    options?: QueryOptions | undefined
  ): Promise<FeedbackDocument>
  list(
    pagination: PaginationParams,
    queryFeedbackDto: QueryFeedbackDto,
    projection?: string | Record<string, any>,
    populate?: Array<PopulateOptions>
  )
}

@Injectable()
export class FeedbackService implements IFeedbackService {
  private readonly appLogger = new AppLogger(FeedbackService.name)
  constructor(
    @InjectConnection() readonly connection: Connection,
    @Inject(IFeedbackRepository)
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject(IClassService)
    private readonly classService: IClassService,
    @Inject(ICourseService)
    private readonly courseService: ICourseService
  ) {}

  public async sendFeedback(
    sendFeedbackDto: SendFeedbackDto,
    classRatingSummaryDto: BaseRatingSummaryDto,
    courseRatingSummaryDto: BaseRatingSummaryDto
  ) {
    const { classId, courseId, rate } = sendFeedbackDto
    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        await this.create(sendFeedbackDto, { session })

        let classTotalCountByRate: BaseRatingTotalCountByRateDto
        let classRatingSummary: BaseRatingSummaryDto
        let classRate: number
        if (!classRatingSummaryDto) {
          classTotalCountByRate = new BaseRatingTotalCountByRateDto()
          classTotalCountByRate[`${rate}`]++
          classRatingSummary = new BaseRatingSummaryDto(rate, 1, classTotalCountByRate)
          classRate = rate
        } else {
          const { totalSum, totalCount, totalCountByRate } = classRatingSummaryDto
          classTotalCountByRate = totalCountByRate
          classTotalCountByRate[`${rate}`]++
          classRatingSummary = new BaseRatingSummaryDto(totalSum + rate, totalCount + 1, classTotalCountByRate)
          classRate = Math.ceil((classRatingSummary.totalSum / classRatingSummary.totalCount) * 10) / 10
        }
        await this.classService.update(
          { _id: classId },
          {
            $set: {
              rate: classRate,
              ratingSummary: classRatingSummary
            }
          },
          { session }
        )

        let courseTotalCountByRate: BaseRatingTotalCountByRateDto
        let courseRatingSummary: BaseRatingSummaryDto
        let courseRate: number
        if (!courseRatingSummaryDto) {
          courseTotalCountByRate = new BaseRatingTotalCountByRateDto()
          courseTotalCountByRate[`${rate}`]++
          courseRatingSummary = new BaseRatingSummaryDto(rate, 1, courseTotalCountByRate)
          courseRate = rate
        } else {
          const { totalSum, totalCount, totalCountByRate } = courseRatingSummaryDto
          courseTotalCountByRate = totalCountByRate
          courseTotalCountByRate[`${rate}`]++
          courseRatingSummary = new BaseRatingSummaryDto(totalSum + rate, totalCount + 1, courseTotalCountByRate)
          courseRate = Math.ceil((courseRatingSummary.totalSum / courseRatingSummary.totalCount) * 10) / 10
        }
        await this.courseService.update(
          { _id: courseId },
          {
            $set: {
              rate: courseRate,
              ratingSummary: courseRatingSummary
            }
          },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }

    return new SuccessResponse(true)
  }

  public async create(sendFeedbackDto: SendFeedbackDto, options?: SaveOptions | undefined) {
    return await this.feedbackRepository.create({ ...sendFeedbackDto }, options)
  }

  public async update(
    conditions: FilterQuery<Feedback>,
    payload: UpdateQuery<Feedback>,
    options?: QueryOptions | undefined
  ) {
    return await this.feedbackRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findById(
    feedbackId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const feedback = await this.feedbackRepository.findOne({
      conditions: {
        _id: feedbackId
      },
      projection,
      populates
    })
    return feedback
  }

  public async findOneBy(
    conditions: FilterQuery<Feedback>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const feedback = await this.feedbackRepository.findOne({
      conditions,
      projection,
      populates
    })
    return feedback
  }

  public async findMany(
    conditions: FilterQuery<FeedbackDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const feedbacks = await this.feedbackRepository.findMany({
      conditions,
      projection,
      populates
    })
    return feedbacks
  }

  async list(
    pagination: PaginationParams,
    queryFeedbackDto: QueryFeedbackDto,
    projection = FEEDBACK_LIST_PROJECTION,
    populate?: Array<PopulateOptions>
  ) {
    const { rate, courseId } = queryFeedbackDto
    const filter: Record<string, any> = {}
    if (courseId) {
      filter['courseId'] = new Types.ObjectId(courseId)
    }

    if (rate) {
      filter['rate'] = rate
    }

    return this.feedbackRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate
    })
  }
}
