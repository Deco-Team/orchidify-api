import { Injectable, Inject } from '@nestjs/common'
import { IInstructorRepository } from '@instructor/repositories/instructor.repository'
import { Instructor, InstructorDocument } from '@instructor/schemas/instructor.schema'
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import { IAuthUserService } from '@auth/services/auth.service'
import { QueryInstructorDto } from '@instructor/dto/view-instructor.dto'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_LIST_PROJECTION } from '@instructor/contracts/constant'
import { InstructorStatus } from '@common/contracts/constant'

export const IInstructorService = Symbol('IInstructorService')

export interface IInstructorService extends IAuthUserService {
  create(instructor: any, options?: SaveOptions | undefined): Promise<InstructorDocument>
  findById(instructorId: string, projection?: string | Record<string, any>): Promise<InstructorDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<InstructorDocument>
  update(
    conditions: FilterQuery<Instructor>,
    payload: UpdateQuery<Instructor>,
    options?: QueryOptions | undefined
  ): Promise<InstructorDocument>
  list(pagination: PaginationParams, queryLearnerDto: QueryInstructorDto)
}

@Injectable()
export class InstructorService implements IInstructorService {
  constructor(
    @Inject(IInstructorRepository)
    private readonly instructorRepository: IInstructorRepository
  ) {}

  public create(instructor: any, options?: SaveOptions | undefined) {
    return this.instructorRepository.create(instructor, options)
  }

  public async findById(instructorId: string, projection?: string | Record<string, any>) {
    const instructor = await this.instructorRepository.findOne({
      conditions: {
        _id: instructorId
      },
      projection
    })
    return instructor
  }

  public async findByEmail(email: string, projection?: string | Record<string, any>) {
    const instructor = await this.instructorRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return instructor
  }

  public update(
    conditions: FilterQuery<Instructor>,
    payload: UpdateQuery<Instructor>,
    options?: QueryOptions | undefined
  ) {
    return this.instructorRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(
    pagination: PaginationParams,
    queryLearnerDto: QueryInstructorDto,
    projection = INSTRUCTOR_LIST_PROJECTION
  ) {
    const { name, email, status } = queryLearnerDto
    const filter: Record<string, any> = {}

    const validStatus = status?.filter((status) => [InstructorStatus.ACTIVE, InstructorStatus.INACTIVE].includes(status))
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

    return this.instructorRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }
}
