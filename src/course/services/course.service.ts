import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateCourseDto } from '@course/dto/create-course.dto'
import { CourseStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION } from '@course/contracts/constant'
import { QueryCourseDto } from '@course/dto/view-course.dto'

export const ICourseService = Symbol('ICourseService')

export interface ICourseService {
  create(course: CreateCourseDto, options?: SaveOptions | undefined): Promise<CourseDocument>
  findById(
    courseId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<CourseDocument>
  update(
    conditions: FilterQuery<Course>,
    payload: UpdateQuery<Course>,
    options?: QueryOptions | undefined
  ): Promise<CourseDocument>
  listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseDto)
}

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async create(createCourseDto: CreateCourseDto, options?: SaveOptions | undefined) {
    const course = await this.courseRepository.create(createCourseDto, options)
    return course
  }

  public async findById(
    courseId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const course = await this.courseRepository.findOne({
      conditions: {
        _id: courseId
      },
      projection,
      populates
    })
    return course
  }

  public update(conditions: FilterQuery<Course>, payload: UpdateQuery<Course>, options?: QueryOptions | undefined) {
    return this.courseRepository.findOneAndUpdate(conditions, payload, options)
  }

  async listByInstructor(
    instructorId: string,
    pagination: PaginationParams,
    queryCourseDto: QueryCourseDto,
    projection = INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION
  ) {
    const { title, status } = queryCourseDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId)
    }

    const validStatus = status?.filter((status) =>
      [
        CourseStatus.DRAFT,
        CourseStatus.PENDING,
        CourseStatus.PUBLISHED,
        CourseStatus.IN_PROGRESS,
        CourseStatus.COMPLETED,
        CourseStatus.CANCELED
      ].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    return this.courseRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }
}
