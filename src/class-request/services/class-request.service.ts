import { Injectable, Inject } from '@nestjs/common'
import * as moment from 'moment-timezone'
import { IClassRequestRepository } from '@src/class-request/repositories/class-request.repository'
import { ClassRequest, ClassRequestDocument } from '@src/class-request/schemas/class-request.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreatePublishClassRequestDto } from '@class-request/dto/create-publish-class-request.dto'
import { ClassRequestStatus, ClassRequestType } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_VIEW_CLASS_REQUEST_LIST_PROJECTION } from '@src/class-request/contracts/constant'
import { QueryClassRequestDto } from '@src/class-request/dto/view-class-request.dto'
import { VN_TIMEZONE } from '@src/config'

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
  listByCreatedBy(createdBy: string, pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto)
  findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]>
  findManyByCreatedByAndStatus(createdBy: string, status?: ClassRequestStatus[]): Promise<ClassRequestDocument[]>
  countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>
}

@Injectable()
export class ClassRequestService implements IClassRequestService {
  constructor(
    @Inject(IClassRequestRepository)
    private readonly classRepository: IClassRequestRepository
  ) {}
  public async createPublishClassRequest(
    createPublishClassRequestDto: CreatePublishClassRequestDto,
    options?: SaveOptions | undefined
  ) {
    const classRequest = await this.classRepository.create(createPublishClassRequestDto, options)
    return classRequest
  }

  public async findById(
    classRequestId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const classRequest = await this.classRepository.findOne({
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
    return this.classRepository.findOneAndUpdate(conditions, payload, options)
  }

  async listByCreatedBy(
    createdBy: string,
    pagination: PaginationParams,
    queryClassRequestDto: QueryClassRequestDto,
    projection = INSTRUCTOR_VIEW_CLASS_REQUEST_LIST_PROJECTION
  ) {
    const { type, status } = queryClassRequestDto
    const filter: Record<string, any> = {
      createdBy: new Types.ObjectId(createdBy)
    }

    const validType = type?.filter((status) =>
      [
        ClassRequestType.PUBLISH_CLASS,
      ].includes(status)
    )
    if (validType?.length > 0) {
      filter['status'] = {
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

    return this.classRepository.model.paginate(filter, {
      ...pagination,
      projection: ['-metadata.lessons', '-metadata.assignments', '-histories']
    })
  }

  async findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]> {
    const classRequests = await this.classRepository.findMany({
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
    const classRequests = await this.classRepository.findMany({
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
    return this.classRepository.model.countDocuments({
      createdBy: new Types.ObjectId(createdBy),
      createdAt: {
        $gte: startOfDate.toDate(),
        $lte: endOfDate.toDate()
      }
    })
  }
}
