import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CourseStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { COURSE_COMBO_LIST_PROJECTION, COURSE_LIST_PROJECTION } from '@course/contracts/constant'
import * as _ from 'lodash'
import { CreateCourseComboDto } from '@course/dto/create-course-combo.dto'
import { QueryCourseComboDto, StaffQueryCourseComboDto } from '@course/dto/view-course-combo.dto'
import { COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

export const ICourseComboService = Symbol('ICourseComboService')

export interface ICourseComboService {
  create(createCourseComboDto: CreateCourseComboDto, options?: SaveOptions | undefined): Promise<CourseDocument>
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
  listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseComboDto)
  listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseComboDto)
  findMany(
    conditions: FilterQuery<CourseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<CourseDocument[]>
}

@Injectable()
export class CourseComboService implements ICourseComboService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async create(createCourseComboDto: CreateCourseComboDto, options?: SaveOptions | undefined) {
    createCourseComboDto['code'] = await this.generateCode()
    const courseCombo = await this.courseRepository.create(createCourseComboDto, options)
    return courseCombo
  }

  public async findById(
    courseId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const course = await this.courseRepository.findOne({
      conditions: {
        _id: courseId,
        childCourseIds: { $ne: [] }
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
    queryCourseDto: QueryCourseComboDto,
    projection = COURSE_COMBO_LIST_PROJECTION
  ) {
    const { title } = queryCourseDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId),
      status: CourseStatus.ACTIVE,
      childCourseIds: { $ne: [] }
    }

    if (title) {
      filter['$text'] = {
        $search: title
      }
    }

    return this.courseRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  async listByStaff(
    pagination: PaginationParams,
    queryCourseDto: StaffQueryCourseComboDto,
    projection = COURSE_COMBO_LIST_PROJECTION
  ) {
    const { title } = queryCourseDto
    const filter: Record<string, any> = {
      status: CourseStatus.ACTIVE,
      childCourseIds: { $ne: [] }
    }

    if (title) {
      filter['$text'] = {
        $search: title
      }
    }

    return this.courseRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate: [
        {
          path: 'instructor',
          select: COURSE_INSTRUCTOR_DETAIL_PROJECTION
        }
      ]
    })
  }

  public async findMany(
    conditions: FilterQuery<CourseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const courses = await this.courseRepository.findMany({
      conditions: {
        childCourseIds: { $ne: [] },
        ...conditions,
      },
      projection,
      populates
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
