import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateCourseDto } from '@course/dto/create-course.dto'
import { CourseStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION } from '@course/contracts/constant'
import { QueryCourseDto } from '@course/dto/view-course.dto'
import { CourseLevel } from '@src/common/contracts/constant'
import * as _ from 'lodash'

export const ICourseService = Symbol('ICourseService')

export interface ICourseService {
  create(createCourseDto: CreateCourseDto, options?: SaveOptions | undefined): Promise<CourseDocument>
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
  findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]>
}

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async create(createCourseDto: CreateCourseDto, options?: SaveOptions | undefined) {
    createCourseDto['code'] = await this.generateCode()
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
    const { title, type, level, status } = queryCourseDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId),
      status: {
        $ne: CourseStatus.DELETED
      }
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
      [CourseStatus.DRAFT, CourseStatus.REQUESTING, CourseStatus.ACTIVE].includes(status)
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

    return this.courseRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  async findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]> {
    const courses = await this.courseRepository.findMany({
      conditions: {
        status: {
          $in: status
        }
      }
    })
    return courses
  }

  private async generateCode(): Promise<string> {
    // Generate OCPxxx format data
    const prefix = `OCP`
    // Find the latest entry with the same date prefix
    const lastRecord = await this.courseRepository.model.findOne().sort({ createdAt: -1 })
    const number = parseInt(_.get(lastRecord, 'code', `${prefix}000`).split(prefix)[1]) + 1
    return `${prefix}${number.toString().padStart(3, '0')}`
  }
}
