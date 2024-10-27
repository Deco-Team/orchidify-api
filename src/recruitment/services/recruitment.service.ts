import { NotificationAdapter } from '@common/adapters/notification.adapter'
import { RecruitmentStatus } from '@common/contracts/constant'
import { SuccessResponse, UserAuth } from '@common/contracts/dto'
import { Errors } from '@common/contracts/error'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { AppException } from '@common/exceptions/app.exception'
import { Injectable, Inject } from '@nestjs/common'
import { RECRUITMENT_LIST_PROJECTION } from '@recruitment/contracts/constant'
import { ProcessRecruitmentApplicationDto } from '@recruitment/dto/process-recruitment-application.dto'
import { RejectRecruitmentProcessDto } from '@recruitment/dto/reject-recruitment-process.dto'
import { QueryRecruitmentDto } from '@recruitment/dto/view-recruitment.dto'
import { IRecruitmentRepository } from '@recruitment/repositories/recruitment.repository'
import { Recruitment, RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'
import { FilterQuery, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'

export const IRecruitmentService = Symbol('IRecruitmentService')

export interface IRecruitmentService {
  create(recruitment: any, options?: SaveOptions | undefined): Promise<RecruitmentDocument>
  findById(recruitmentId: string, projection?: string | Record<string, any>): Promise<RecruitmentDocument>
  findByApplicationEmailAndStatus(applicationEmail: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]>
  findByHandledByAndStatus(handledBy: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]>
  update(
    conditions: FilterQuery<Recruitment>,
    payload: UpdateQuery<Recruitment>,
    options?: QueryOptions | undefined
  ): Promise<RecruitmentDocument>
  list(pagination: PaginationParams, queryRecruitmentDto: QueryRecruitmentDto)
  processRecruitmentApplication(
    recruitmentId: string,
    processRecruitmentApplicationDto: ProcessRecruitmentApplicationDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse>
  processRecruitmentInterview(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse>
  rejectRecruitmentProcess(
    recruitmentId: string,
    rejectRecruitmentProcessDto: RejectRecruitmentProcessDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse>
}

@Injectable()
export class RecruitmentService implements IRecruitmentService {
  constructor(
    @Inject(IRecruitmentRepository)
    private readonly recruitmentRepository: IRecruitmentRepository,
    private readonly notificationAdapter: NotificationAdapter
  ) {}

  public create(recruitment: any, options?: SaveOptions | undefined) {
    return this.recruitmentRepository.create(recruitment, options)
  }

  public async findById(recruitmentId: string, projection?: string | Record<string, any>) {
    const recruitment = await this.recruitmentRepository.findOne({
      conditions: {
        _id: recruitmentId
      },
      projection
    })
    return recruitment
  }

  findByApplicationEmailAndStatus(
    applicationEmail: string,
    status: RecruitmentStatus[]
  ): Promise<RecruitmentDocument[]> {
    return this.recruitmentRepository.findMany({
      conditions: {
        'applicationInfo.email': applicationEmail,
        status: {
          $in: status
        }
      }
    })
  }

  findByHandledByAndStatus(handledBy: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]> {
    return this.recruitmentRepository.findMany({
      conditions: {
        handledBy: new Types.ObjectId(handledBy),
        status: {
          $in: status
        }
      }
    })
  }

  public update(
    conditions: FilterQuery<Recruitment>,
    payload: UpdateQuery<Recruitment>,
    options?: QueryOptions | undefined
  ) {
    return this.recruitmentRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(
    pagination: PaginationParams,
    queryLearnerDto: QueryRecruitmentDto,
    projection = RECRUITMENT_LIST_PROJECTION
  ) {
    const { name, email, status } = queryLearnerDto
    const filter: Record<string, any> = {}

    const validStatus = status?.filter((status) =>
      [
        RecruitmentStatus.PENDING,
        RecruitmentStatus.INTERVIEWING,
        RecruitmentStatus.SELECTED,
        RecruitmentStatus.EXPIRED,
        RecruitmentStatus.REJECTED
      ].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    let textSearch = ''
    if (name) textSearch += name.trim()
    if (email) textSearch += ' ' + email.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch.trim()
      }
    }

    return this.recruitmentRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  async processRecruitmentApplication(
    recruitmentId: string,
    processRecruitmentApplicationDto: ProcessRecruitmentApplicationDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse> {
    const { meetingUrl } = processRecruitmentApplicationDto
    const { _id, role } = userAuth

    // validate recruitment
    const recruitment = await this.findById(recruitmentId)
    if (!recruitment) throw new AppException(Errors.RECRUITMENT_NOT_FOUND)
    if (recruitment.status !== RecruitmentStatus.PENDING) throw new AppException(Errors.RECRUITMENT_STATUS_INVALID)

    await this.recruitmentRepository.findOneAndUpdate(
      { _id: recruitmentId },
      {
        $set: {
          status: RecruitmentStatus.INTERVIEWING,
          handledBy: new Types.ObjectId(_id),
          meetingUrl
        },
        $push: {
          histories: {
            status: RecruitmentStatus.INTERVIEWING,
            timestamp: new Date(),
            userId: new Types.ObjectId(_id),
            userRole: role
          }
        }
      }
    )

    // send notification
    this.notificationAdapter.sendMail({
      to: recruitment?.applicationInfo?.email,
      subject: `[Orchidify] Mời phỏng vấn vị trí Giảng viên - Orchidify`,
      template: 'viewer/process-recruitment-application',
      context: {
        platform: 'Google Meet',
        meetingUrl: meetingUrl,
        name: recruitment?.applicationInfo?.name
      }
    })
    return new SuccessResponse(true)
  }

  async processRecruitmentInterview(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse> {
    const { _id, role } = userAuth

    // validate recruitment
    const recruitment = await this.findById(recruitmentId)
    if (!recruitment) throw new AppException(Errors.RECRUITMENT_NOT_FOUND)
    if (recruitment.status !== RecruitmentStatus.INTERVIEWING) throw new AppException(Errors.RECRUITMENT_STATUS_INVALID)

    //BR-18: Staff who verify the CV will be in charge of the recruitment process.
    if (recruitment.handledBy.toString() !== _id)
      throw new AppException(Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF)

    await this.recruitmentRepository.findOneAndUpdate(
      { _id: recruitmentId },
      {
        $set: {
          status: RecruitmentStatus.SELECTED
        },
        $push: {
          histories: {
            status: RecruitmentStatus.SELECTED,
            timestamp: new Date(),
            userId: new Types.ObjectId(_id),
            userRole: role
          }
        }
      }
    )
    // send notification
    this.notificationAdapter.sendMail({
      to: recruitment?.applicationInfo?.email,
      subject: `[Orchidify] Chúc mừng bạn đã trở thành một phần của Orchidify`,
      template: 'viewer/process-recruitment-interview',
      context: {
        name: recruitment?.applicationInfo?.name
      }
    })
    return new SuccessResponse(true)
  }

  async rejectRecruitmentProcess(
    recruitmentId: string,
    rejectRecruitmentProcessDto: RejectRecruitmentProcessDto,
    userAuth: UserAuth
  ): Promise<SuccessResponse> {
    const { rejectReason } = rejectRecruitmentProcessDto
    const { _id, role } = userAuth

    // validate recruitment
    const recruitment = await this.findById(recruitmentId)
    if (!recruitment) throw new AppException(Errors.RECRUITMENT_NOT_FOUND)
    if ([RecruitmentStatus.PENDING, RecruitmentStatus.INTERVIEWING].includes(recruitment.status) === false)
      throw new AppException(Errors.RECRUITMENT_STATUS_INVALID)

    //BR-18: Staff who verify the CV will be in charge of the recruitment process.
    if (recruitment.status === RecruitmentStatus.INTERVIEWING && recruitment.handledBy.toString() !== _id)
      throw new AppException(Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF)

    await this.recruitmentRepository.findOneAndUpdate(
      { _id: recruitmentId },
      {
        $set: {
          status: RecruitmentStatus.REJECTED,
          rejectReason
        },
        $push: {
          histories: {
            status: RecruitmentStatus.REJECTED,
            timestamp: new Date(),
            userId: new Types.ObjectId(_id),
            userRole: role
          }
        }
      }
    )
    // send notification
    const mailTemplate =
      recruitment.status === RecruitmentStatus.PENDING
        ? 'viewer/reject-recruitment-application.ejs'
        : 'viewer/reject-recruitment-interview.ejs'
    this.notificationAdapter.sendMail({
      to: recruitment?.applicationInfo?.email,
      subject: `[Orchidify] Thông báo về kết quả ứng tuyển giảng viên`,
      template: mailTemplate,
      context: {
        name: recruitment?.applicationInfo?.name
      }
    })
    return new SuccessResponse(true)
  }
}
