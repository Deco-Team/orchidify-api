import { Injectable, Inject } from '@nestjs/common'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Class, ClassDocument } from '@src/class/schemas/class.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateClassDto } from '@class/dto/create-class.dto'
import { ClassStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_VIEW_CLASS_LIST_PROJECTION } from '@src/class/contracts/constant'
import { QueryClassDto } from '@src/class/dto/view-class.dto'

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
  findManyByStatus(status: ClassStatus[]): Promise<ClassDocument[]>
  findManyByInstructorIdAndStatus(instructorId: string, status: ClassStatus[]): Promise<ClassDocument[]>
}

@Injectable()
export class ClassService implements IClassService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository
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
    projection = INSTRUCTOR_VIEW_CLASS_LIST_PROJECTION
  ) {
    const { title, status } = queryClassDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId)
    }

    const validStatus = status?.filter((status) =>
      [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    return this.classRepository.model.paginate(filter, {
      ...pagination,
      projection
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
}
