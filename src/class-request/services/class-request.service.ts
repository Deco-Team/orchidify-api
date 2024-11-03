import { Injectable, Inject } from '@nestjs/common'
import * as moment from 'moment-timezone'
import * as _ from 'lodash'
import { IClassRequestRepository } from '@src/class-request/repositories/class-request.repository'
import { ClassRequest, ClassRequestDocument } from '@src/class-request/schemas/class-request.schema'
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreatePublishClassRequestDto } from '@class-request/dto/create-publish-class-request.dto'
import { ClassRequestStatus, ClassRequestType, ClassStatus, CourseStatus, Weekday } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { CLASS_REQUEST_LIST_PROJECTION } from '@src/class-request/contracts/constant'
import { QueryClassRequestDto } from '@src/class-request/dto/view-class-request.dto'
import { VN_TIMEZONE } from '@src/config'
import { SuccessResponse, UserAuth } from '@common/contracts/dto'
import { ApprovePublishClassRequestDto } from '@class-request/dto/approve-publish-class-request.dto'
import { RejectPublishClassRequestDto } from '@class-request/dto/reject-publish-class-request.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ICourseService } from '@course/services/course.service'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { AppLogger } from '@common/services/app-logger.service'
import { IClassService } from '@class/services/class.service'
import { InjectConnection } from '@nestjs/mongoose'
import { BaseProgressDto } from '@class/dto/progress.dto'
import { IQueueProducerService } from '@queue/services/queue-producer.service'
import { JobName, QueueName } from '@queue/contracts/constant'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'
import { HelperService } from '@common/services/helper.service'

export const IClassRequestService = Symbol('IClassRequestService')

export interface IClassRequestService {
  createPublishClassRequest(
    createPublishClassRequestDto: CreatePublishClassRequestDto,
    options?: SaveOptions | undefined
  ): Promise<ClassRequestDocument>
  findById(
    classRequestId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ClassRequestDocument>
  update(
    conditions: FilterQuery<ClassRequest>,
    payload: UpdateQuery<ClassRequest>,
    options?: QueryOptions | undefined
  ): Promise<ClassRequestDocument>
  list(pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto)
  findMany(
    conditions: FilterQuery<ClassRequestDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ClassRequestDocument[]>
  findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]>
  findManyByCreatedByAndStatus(createdBy: string, status?: ClassRequestStatus[]): Promise<ClassRequestDocument[]>
  countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>
  cancelPublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>
  expirePublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>
  approvePublishClassRequest(
    classRequestId: string,
    approvePublishClassRequestDto: ApprovePublishClassRequestDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse>
  rejectPublishClassRequest(
    classRequestId: string,
    rejectPublishClassRequestDto: RejectPublishClassRequestDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse>
}

@Injectable()
export class ClassRequestService implements IClassRequestService {
  private readonly appLogger = new AppLogger(ClassRequestService.name)
  constructor(
    @Inject(IClassRequestRepository)
    private readonly classRequestRepository: IClassRequestRepository,
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService,
    @Inject(IClassService)
    private readonly classService: IClassService,
    @InjectConnection() readonly connection: Connection,
    @Inject(IQueueProducerService)
    private readonly queueProducerService: IQueueProducerService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService,
    private readonly helperService: HelperService
  ) {}
  public async createPublishClassRequest(
    createPublishClassRequestDto: CreatePublishClassRequestDto,
    options?: SaveOptions | undefined
  ) {
    const classRequest = await this.classRequestRepository.create(createPublishClassRequestDto, options)
    this.addClassRequestAutoExpiredJob(classRequest)

    return classRequest
  }

  public async findById(
    classRequestId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const classRequest = await this.classRequestRepository.findOne({
      conditions: {
        _id: classRequestId
      },
      projection,
      populates
    })
    return classRequest
  }

  public update(
    conditions: FilterQuery<ClassRequest>,
    payload: UpdateQuery<ClassRequest>,
    options?: QueryOptions | undefined
  ) {
    return this.classRequestRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(
    pagination: PaginationParams,
    queryClassRequestDto: QueryClassRequestDto,
    projection = CLASS_REQUEST_LIST_PROJECTION
  ) {
    const { type, status, createdBy } = queryClassRequestDto
    const filter: Record<string, any> = {}

    if (createdBy) {
      filter['createdBy'] = new Types.ObjectId(createdBy)
    }

    const validType = type?.filter((type) => [ClassRequestType.PUBLISH_CLASS].includes(type))
    if (validType?.length > 0) {
      filter['type'] = {
        $in: validType
      }
    }

    const validStatus = status?.filter((status) =>
      [
        ClassRequestStatus.PENDING,
        ClassRequestStatus.APPROVED,
        ClassRequestStatus.CANCELED,
        ClassRequestStatus.EXPIRED,
        ClassRequestStatus.REJECTED
      ].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    return this.classRequestRepository.model.paginate(filter, {
      ...pagination,
      projection: ['-metadata.sessions', '-metadata.media', '-histories']
    })
  }

  public async findMany(
    conditions: FilterQuery<ClassRequestDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const classRequests = await this.classRequestRepository.findMany({
      conditions,
      projection,
      populates
    })
    return classRequests
  }

  async findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]> {
    const classRequests = await this.classRequestRepository.findMany({
      conditions: {
        status: {
          $in: status
        }
      }
    })
    return classRequests
  }

  async findManyByCreatedByAndStatus(
    createdBy: string,
    status?: ClassRequestStatus[]
  ): Promise<ClassRequestDocument[]> {
    const classRequests = await this.classRequestRepository.findMany({
      conditions: {
        createdBy: new Types.ObjectId(createdBy),
        status: {
          $in: status
        }
      }
    })
    return classRequests
  }

  countByCreatedByAndDate(createdBy: string, date: Date): Promise<number> {
    const startOfDate = moment(date).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = moment(date).tz(VN_TIMEZONE).endOf('date')
    return this.classRequestRepository.model.countDocuments({
      createdBy: new Types.ObjectId(createdBy),
      createdAt: {
        $gte: startOfDate.toDate(),
        $lte: endOfDate.toDate()
      }
    })
  }

  async cancelPublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse> {
    const { _id, role } = userAuth

    // validate class request
    const classRequest = await this.findById(classRequestId)
    if (
      !classRequest ||
      classRequest.type !== ClassRequestType.PUBLISH_CLASS ||
      classRequest.createdBy.toString() !== _id
    )
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    if (classRequest.status !== ClassRequestStatus.PENDING) throw new AppException(Errors.CLASS_REQUEST_STATUS_INVALID)

    // validate course
    const course = await this.courseService.findById(classRequest.courseId?.toString())
    if (!course || course.instructorId.toString() !== _id) throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status === CourseStatus.DELETED) throw new AppException(Errors.COURSE_STATUS_INVALID)

    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        // update class request
        await this.update(
          { _id: classRequestId },
          {
            $set: {
              status: ClassRequestStatus.CANCELED
            },
            $push: {
              histories: {
                status: ClassRequestStatus.CANCELED,
                timestamp: new Date(),
                userId: new Types.ObjectId(_id),
                userRole: role
              }
            }
          },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }
    this.queueProducerService.removeJob(QueueName.CLASS_REQUEST, classRequestId)
    return new SuccessResponse(true)
  }

  async approvePublishClassRequest(
    classRequestId: string,
    approvePublishClassRequestDto: ApprovePublishClassRequestDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse> {
    const { gardenId } = approvePublishClassRequestDto
    const { _id, role } = userAuth
    // validate class request
    const classRequest = await this.findById(classRequestId)
    if (!classRequest || classRequest.type !== ClassRequestType.PUBLISH_CLASS)
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    if (classRequest.status !== ClassRequestStatus.PENDING) throw new AppException(Errors.CLASS_REQUEST_STATUS_INVALID)

    // validate course
    const course = await this.courseService.findById(classRequest.courseId?.toString(), ['+sessions'])
    if (!course) throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status === CourseStatus.DELETED) throw new AppException(Errors.COURSE_STATUS_INVALID)

    // validate gardenId fit with time of class request
    const { startDate, duration, weekdays, slotNumbers } = classRequest?.metadata
    const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
      startDate,
      duration,
      weekdays,
      instructorId: course.instructorId
    })
    this.appLogger.log(
      `getAvailableGardenList: slotNumbers=${slotNumbers}, availableSlotNumbers=${
        availableSlots.slotNumbers
      }, availableTimeOfGardens=${JSON.stringify(availableSlots.availableTimeOfGardens)}`
    )
    if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0)
      throw new AppException(Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST)

    const availableGardens = availableSlots.availableTimeOfGardens.filter((availableTimeOfGarden) => {
      this.appLogger.log(`gardenId=${availableTimeOfGarden.gardenId}, slotNumbers=${availableTimeOfGarden.slotNumbers}`)
      return _.difference(slotNumbers, availableTimeOfGarden.slotNumbers).length === 0
    })
    if (availableGardens.length === 0) throw new AppException(Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST)

    const garden = availableGardens.find((availableGarden) => availableGarden.gardenId?.toString() === gardenId)
    if (!garden) throw new AppException(Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST)

    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        // update class request
        await this.classRequestRepository.findOneAndUpdate(
          { _id: classRequestId },
          {
            $set: {
              status: ClassRequestStatus.APPROVED
            },
            $push: {
              histories: {
                status: ClassRequestStatus.APPROVED,
                timestamp: new Date(),
                userId: new Types.ObjectId(_id),
                userRole: role
              }
            }
          },
          { session }
        )

        // update course
        await this.courseService.update(
          { _id: classRequest.courseId },
          {
            $set: {
              status: CourseStatus.ACTIVE,
              isPublished: true
            }
          },
          { session }
        )

        // create new class
        const classData = _.pick(classRequest.metadata, [
          'title',
          'description',
          'startDate',
          'price',
          'level',
          'type',
          'duration',
          'thumbnail',
          'media',
          'sessions',
          'learnerLimit',
          'weekdays',
          'slotNumbers',
          'gardenRequiredToolkits',
          'instructorId'
        ])
        classData['code'] = await this.classService.generateCode()
        classData['status'] = ClassStatus.PUBLISHED
        classData['histories'] = [
          {
            status: ClassStatus.PUBLISHED,
            timestamp: new Date(),
            userId: new Types.ObjectId(_id),
            userRole: role
          }
        ]
        classData['learnerQuantity'] = 0
        classData['gardenId'] = new Types.ObjectId(gardenId)
        classData['courseId'] = classRequest.courseId
        classData['progress'] = new BaseProgressDto(_.get(classData, ['duration']) * 2, 0)
        const createdClass = await this.classService.create(classData, { session })

        // gen slots for class
        await this.gardenTimesheetService.generateSlotsForClass(
          {
            startDate,
            duration,
            weekdays,
            slotNumbers,
            gardenId: new Types.ObjectId(gardenId),
            instructorId: course.instructorId,
            classId: new Types.ObjectId(createdClass._id),
            metadata: { code: createdClass.code, title: createdClass.title },
            courseData: course
          },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }
    // TODO: send notification
    this.queueProducerService.removeJob(QueueName.CLASS_REQUEST, classRequestId)
    return new SuccessResponse(true)
  }

  async rejectPublishClassRequest(
    classRequestId: string,
    rejectPublishClassRequestDto: RejectPublishClassRequestDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse> {
    const { rejectReason } = rejectPublishClassRequestDto
    const { _id, role } = userAuth

    // validate class request
    const classRequest = await this.findById(classRequestId)
    if (!classRequest || classRequest.type !== ClassRequestType.PUBLISH_CLASS)
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    if (classRequest.status !== ClassRequestStatus.PENDING) throw new AppException(Errors.CLASS_REQUEST_STATUS_INVALID)

    // validate course
    const course = await this.courseService.findById(classRequest.courseId?.toString())
    if (!course) throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status === CourseStatus.DELETED) throw new AppException(Errors.COURSE_STATUS_INVALID)

    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        // update class request
        await this.update(
          { _id: classRequestId },
          {
            $set: {
              status: ClassRequestStatus.REJECTED,
              rejectReason
            },
            $push: {
              histories: {
                status: ClassRequestStatus.REJECTED,
                timestamp: new Date(),
                userId: new Types.ObjectId(_id),
                userRole: role
              }
            }
          },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }
    // TODO: send notification
    this.queueProducerService.removeJob(QueueName.CLASS_REQUEST, classRequestId)
    return new SuccessResponse(true)
  }

  async expirePublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse> {
    const { role } = userAuth

    // validate class request
    const classRequest = await this.findById(classRequestId)
    if (!classRequest || classRequest.type !== ClassRequestType.PUBLISH_CLASS)
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    if (classRequest.status !== ClassRequestStatus.PENDING) throw new AppException(Errors.CLASS_REQUEST_STATUS_INVALID)

    // validate course
    const course = await this.courseService.findById(classRequest.courseId?.toString())
    if (!course) throw new AppException(Errors.COURSE_NOT_FOUND)
    if (course.status === CourseStatus.DELETED) throw new AppException(Errors.COURSE_STATUS_INVALID)

    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        // update class request
        await this.update(
          { _id: classRequestId },
          {
            $set: {
              status: ClassRequestStatus.EXPIRED
            },
            $push: {
              histories: {
                status: ClassRequestStatus.EXPIRED,
                timestamp: new Date(),
                userRole: role
              }
            }
          },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }
    // TODO: send notification
    return new SuccessResponse(true)
  }

  async getExpiredAt(date: Date): Promise<Date> {
    const classRequestAutoExpiration = await this.settingService.findByKey(SettingKey.ClassRequestAutoExpiration)
    const dateMoment = moment.tz(date, VN_TIMEZONE)
    const expiredDate = dateMoment.clone().add(Number(classRequestAutoExpiration.value) || 2, 'day')
    let expiredAt = expiredDate.clone()
    
    // check in weekdays
    let currentDate = dateMoment.clone()
    while (currentDate.isSameOrBefore(expiredDate)) {
      // Sunday: isoWeekday=7
      if(currentDate.clone().isoWeekday() === 7) {
        expiredAt.add(1, 'day')
      }
      currentDate.add(1, 'day')
    }

    return expiredAt.toDate()
  }

  async addClassRequestAutoExpiredJob(classRequest: ClassRequest) {
    try {
      const expiredAt = await this.getExpiredAt(classRequest['createdAt'])
      const delayTime = this.helperService.getDiffTimeByMilliseconds(expiredAt)

      await this.queueProducerService.addJob(
        QueueName.CLASS_REQUEST,
        JobName.ClassRequestAutoExpired,
        {
          classRequestId: classRequest._id,
          expiredAt
        },
        {
          delay: delayTime,
          jobId: classRequest._id.toString()
        }
      )
    } catch (err) {
      this.appLogger.error(JSON.stringify(err))
    }
  }
}
