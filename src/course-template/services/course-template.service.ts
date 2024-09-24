import { Injectable, Inject } from '@nestjs/common'
import { ICourseTemplateRepository } from '@course-template/repositories/course-template.repository'
import { CourseTemplate, CourseTemplateDocument } from '@course-template/schemas/course-template.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateCourseTemplateDto } from '@course-template/dto/create-course-template.dto'
import { CourseTemplateStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { INSTRUCTOR_VIEW_COURSE_TEMPLATE_LIST_PROJECTION } from '@course-template/contracts/constant'
import { QueryCourseTemplateDto } from '@course-template/dto/view-course-template.dto'
import { CourseLevel } from '@course/contracts/constant'

export const ICourseTemplateService = Symbol('ICourseTemplateService')

export interface ICourseTemplateService {
  create(
    CreateCourseTemplateDto: CreateCourseTemplateDto,
    options?: SaveOptions | undefined
  ): Promise<CourseTemplateDocument>
  findById(
    courseTemplateId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<CourseTemplateDocument>
  update(
    conditions: FilterQuery<CourseTemplate>,
    payload: UpdateQuery<CourseTemplate>,
    options?: QueryOptions | undefined
  ): Promise<CourseTemplateDocument>
  listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseTemplateDto: QueryCourseTemplateDto)
  findManyByStatus(status: CourseTemplateStatus[]): Promise<CourseTemplateDocument[]>
}

@Injectable()
export class CourseTemplateService implements ICourseTemplateService {
  constructor(
    @Inject(ICourseTemplateRepository)
    private readonly courseTemplateRepository: ICourseTemplateRepository
  ) {}

  public async create(createCourseTemplateDto: CreateCourseTemplateDto, options?: SaveOptions | undefined) {
    const course = await this.courseTemplateRepository.create(createCourseTemplateDto, options)
    return course
  }

  public async findById(
    courseTemplateId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const courseTemplate = await this.courseTemplateRepository.findOne({
      conditions: {
        _id: courseTemplateId
      },
      projection,
      populates
    })
    return courseTemplate
  }

  public update(
    conditions: FilterQuery<CourseTemplate>,
    payload: UpdateQuery<CourseTemplate>,
    options?: QueryOptions | undefined
  ) {
    return this.courseTemplateRepository.findOneAndUpdate(conditions, payload, options)
  }

  async listByInstructor(
    instructorId: string,
    pagination: PaginationParams,
    queryCourseTemplateDto: QueryCourseTemplateDto,
    projection = INSTRUCTOR_VIEW_COURSE_TEMPLATE_LIST_PROJECTION
  ) {
    const { title, type, level, status } = queryCourseTemplateDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId),
      status: {
        $ne: CourseTemplateStatus.DELETED
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
      [CourseTemplateStatus.DRAFT, CourseTemplateStatus.REQUESTING, CourseTemplateStatus.ACTIVE].includes(status)
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

    return this.courseTemplateRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  async findManyByStatus(status: CourseTemplateStatus[]): Promise<CourseTemplateDocument[]> {
    const courseTemplates = await this.courseTemplateRepository.findMany({
      conditions: {
        status: {
          $in: status
        }
      }
    })
    return courseTemplates
  }
}
