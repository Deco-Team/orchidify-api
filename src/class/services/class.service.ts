import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Class, ClassDocument } from '@src/class/schemas/class.schema'
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateClassDto } from '@class/dto/create-class.dto'
import { ClassStatus, CourseLevel, LearnerStatus, TransactionStatus, UserRole } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { CLASS_LIST_PROJECTION } from '@src/class/contracts/constant'
import { QueryClassDto } from '@src/class/dto/view-class.dto'
import { InjectConnection } from '@nestjs/mongoose'
import { CreateMomoPaymentDto, CreateMomoPaymentResponse } from '@src/transaction/dto/momo-payment.dto'
import { PaymentMethod, TransactionType } from '@src/transaction/contracts/constant'
import { ConfigService } from '@nestjs/config'
import { IPaymentService } from '@src/transaction/services/payment.service'
import { EnrollClassDto } from '@class/dto/enroll-class.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ILearnerService } from '@learner/services/learner.service'
import { ITransactionService } from '@transaction/services/transaction.service'
import { BasePaymentDto } from '@transaction/dto/base.transaction.dto'
import { ILearnerClassService } from './learner-class.service'

export const IClassService = Symbol('IClassService')

export interface IClassService {
  create(courseClass: CreateClassDto, options?: SaveOptions | undefined): Promise<ClassDocument>
  findById(
    classId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ClassDocument>
  update(
    conditions: FilterQuery<Class>,
    payload: UpdateQuery<Class>,
    options?: QueryOptions | undefined
  ): Promise<ClassDocument>
  listByInstructor(instructorId: string, pagination: PaginationParams, queryClassDto: QueryClassDto)
  listByStaff(pagination: PaginationParams, queryClassDto: QueryClassDto)
  findManyByStatus(status: ClassStatus[]): Promise<ClassDocument[]>
  findManyByInstructorIdAndStatus(instructorId: string, status: ClassStatus[]): Promise<ClassDocument[]>
  findManyByGardenIdAndStatus(gardenId: string, status: ClassStatus[]): Promise<ClassDocument[]>
  generateCode(): Promise<string>
  enrollClass(enrollClassDto: EnrollClassDto): Promise<CreateMomoPaymentResponse>
}

@Injectable()
export class ClassService implements IClassService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    @InjectConnection() readonly connection: Connection,
    private readonly configService: ConfigService,
    @Inject(IPaymentService)
    private readonly paymentService: IPaymentService,
    @Inject(ITransactionService)
    private readonly transactionService: ITransactionService,
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
  ) {}

  public async create(createClassDto: CreateClassDto, options?: SaveOptions | undefined) {
    const courseClass = await this.classRepository.create(createClassDto, options)
    return courseClass
  }

  public async findById(
    classId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const courseClass = await this.classRepository.findOne({
      conditions: {
        _id: classId
      },
      projection,
      populates
    })
    return courseClass
  }

  public update(conditions: FilterQuery<Class>, payload: UpdateQuery<Class>, options?: QueryOptions | undefined) {
    return this.classRepository.findOneAndUpdate(conditions, payload, options)
  }

  async listByInstructor(
    instructorId: string,
    pagination: PaginationParams,
    queryClassDto: QueryClassDto,
    projection = CLASS_LIST_PROJECTION
  ) {
    const { title, type, level, status } = queryClassDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId)
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      filter['level'] = {
        $in: validLevel
      }
    }

    const validStatus = status?.filter((status) =>
      [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    let textSearch = ''
    if (title) textSearch += title.trim()
    if (type) textSearch += ' ' + type.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch.trim()
      }
    }

    return this.classRepository.model.paginate(filter, {
      ...pagination,
      populate: [
        {
          path: 'course',
          select: ['code']
        }
      ],
      projection
    })
  }

  async listByStaff(pagination: PaginationParams, queryClassDto: QueryClassDto, projection = CLASS_LIST_PROJECTION) {
    const { title, type, level, status } = queryClassDto
    const filter: Record<string, any> = {}

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      filter['level'] = {
        $in: validLevel
      }
    }

    const validStatus = status?.filter((status) =>
      [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    let textSearch = ''
    if (title) textSearch += title.trim()
    if (type) textSearch += ' ' + type.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch.trim()
      }
    }

    return this.classRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate: [
        {
          path: 'course',
          select: ['code']
        }
      ]
    })
  }

  async findManyByStatus(status: ClassStatus[]): Promise<ClassDocument[]> {
    const courseClasses = await this.classRepository.findMany({
      conditions: {
        status: {
          $in: status
        }
      }
    })
    return courseClasses
  }

  async findManyByInstructorIdAndStatus(instructorId: string, status: ClassStatus[]): Promise<ClassDocument[]> {
    const courseClasses = await this.classRepository.findMany({
      conditions: {
        instructorId: new Types.ObjectId(instructorId),
        status: {
          $in: status
        }
      }
    })
    return courseClasses
  }

  async findManyByGardenIdAndStatus(gardenId: string, status: ClassStatus[]): Promise<ClassDocument[]> {
    const courseClasses = await this.classRepository.findMany({
      conditions: {
        gardenId: new Types.ObjectId(gardenId),
        status: {
          $in: status
        }
      }
    })
    return courseClasses
  }

  public async generateCode(): Promise<string> {
    // Generate ORCHIDxxx format data
    const prefix = `ORCHID`
    // Find the latest entry with the same date prefix
    const lastRecord = await this.classRepository.model.findOne().sort({ createdAt: -1 })
    const number = parseInt(_.get(lastRecord, 'code', `${prefix}000`).split(prefix)[1]) + 1
    return `${prefix}${number.toString().padStart(3, '0')}`
  }

  public async enrollClass(enrollClassDto: EnrollClassDto) {
    const { classId, paymentMethod, learnerId, requestType = 'captureWallet' } = enrollClassDto
    // 1. Validate class, learner, learnerClass(learner had enrolled class before)
    const [learner, courseClass, learnerClass] = await Promise.all([
      this.learnerService.findById(learnerId?.toString()),
      this.findById(classId?.toString()),
      this.learnerClassService.findOneBy({ learnerId, classId })
    ])
    if (learner.status === LearnerStatus.UNVERIFIED) throw new AppException(Errors.UNVERIFIED_ACCOUNT)
    if (learner.status === LearnerStatus.INACTIVE) throw new AppException(Errors.INACTIVE_ACCOUNT)
    if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)
    if (courseClass.status !== ClassStatus.PUBLISHED) throw new AppException(Errors.CLASS_STATUS_INVALID)
    if (courseClass.learnerQuantity >= courseClass.learnerLimit) throw new AppException(Errors.CLASS_LEARNER_LIMIT)
    if (learnerClass) throw new AppException(Errors.LEARNER_CLASS_EXISTED)

    // Execute in transaction
    const session = await this.connection.startSession()
    let paymentResponse: CreateMomoPaymentResponse
    try {
      await session.withTransaction(async () => {
        // 2. Process transaction
        const MAX_VALUE = 9_007_199_254_740_991
        const MIM_VALUE = 1_000_000_000_000_000
        const orderCode = Math.floor(MIM_VALUE + Math.random() * (MAX_VALUE - MIM_VALUE))
        const orderInfo = `Orchidify - Thanh toán đơn hàng #${orderCode}`
        switch (paymentMethod) {
          case PaymentMethod.MOMO:
            this.paymentService.setStrategy(PaymentMethod.MOMO)
            const createMomoPaymentDto: CreateMomoPaymentDto = {
              partnerName: 'ORCHIDIFY',
              orderInfo,
              redirectUrl: `${this.configService.get('WEB_URL')}/my-classes`,
              ipnUrl: `${this.configService.get('SERVER_URL')}/transactions/payment/webhook/momo`,
              requestType,
              amount: courseClass.price,
              orderId: orderCode.toString(),
              requestId: orderCode.toString(),
              extraData: JSON.stringify({ classId, learnerId }),
              autoCapture: true,
              lang: 'vi',
              orderExpireTime: 30
            }
            paymentResponse = await this.paymentService.createTransaction(createMomoPaymentDto)
            break
          case PaymentMethod.ZALO_PAY:
          case PaymentMethod.PAY_OS:
          default:
            break
        }

        // 3. Create transaction
        const transaction = await this.paymentService.getTransaction({
          orderId: paymentResponse.orderId,
          requestId: paymentResponse.requestId,
          lang: 'vi'
        })
        const paymentPayload = {
          id: transaction?.transId?.toString(),
          code: orderCode.toString(),
          createdAt: new Date(),
          status: transaction?.resultCode?.toString(),
          ...transaction
        }
        const payment: BasePaymentDto = {
          ...paymentPayload,
          histories: [paymentPayload]
        }
        await this.transactionService.create(
          {
            type: TransactionType.PAYMENT,
            paymentMethod,
            amount: courseClass.price,
            debitAccount: { userId: learnerId, userRole: UserRole.LEARNER },
            creditAccount: { userRole: 'SYSTEM' as UserRole },
            description: orderInfo,
            status: TransactionStatus.DRAFT,
            payment
          },
          {
            session
          }
        )
      })
      return paymentResponse
    } finally {
      await session.endSession()
    }
  }
}
