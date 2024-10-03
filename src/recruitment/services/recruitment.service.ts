import { RecruitmentStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { Injectable, Inject } from '@nestjs/common'
import { RECRUITMENT_LIST_PROJECTION } from '@recruitment/contracts/constant'
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
}

@Injectable()
export class RecruitmentService implements IRecruitmentService {
  constructor(
    @Inject(IRecruitmentRepository)
    private readonly recruitmentRepository: IRecruitmentRepository
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
}
