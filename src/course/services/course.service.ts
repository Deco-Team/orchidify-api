import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateCourseDto } from '@course/dto/create-course.dto'
import { ClassStatus, CourseStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { COURSE_LIST_PROJECTION } from '@course/contracts/constant'
import { QueryCourseDto, PublicQueryCourseDto, StaffQueryCourseDto } from '@course/dto/view-course.dto'
import { CourseLevel } from '@src/common/contracts/constant'
import * as _ from 'lodash'
import { HelperService } from '@common/services/helper.service'
import { COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import { UserAuth } from '@common/contracts/dto'
import { ILearnerClassService } from '@class/services/learner-class.service'

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
  listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseDto)
  listPublicCourses(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto)
  listByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth)
  listBestSellerCoursesByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth)
  listRecommendedCoursesByLearner(
    pagination: PaginationParams,
    queryCourseDto: PublicQueryCourseDto,
    userAuth: UserAuth
  )
  findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]>
  findMany(
    conditions: FilterQuery<CourseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<CourseDocument[]>
  viewReportCourseByRate(): Promise<any[]>
}

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    private readonly helperService: HelperService,
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
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
        _id: courseId,
        childCourseIds: []
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
    projection = COURSE_LIST_PROJECTION
  ) {
    const { title, type, level, status } = queryCourseDto
    const filter: Record<string, any> = {
      instructorId: new Types.ObjectId(instructorId),
      status: {
        $ne: CourseStatus.DELETED
      },
      childCourseIds: []
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      filter['level'] = {
        $in: validLevel
      }
    }

    const validStatus = status?.filter((status) => [CourseStatus.DRAFT, CourseStatus.ACTIVE].includes(status))
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    if (title) {
      filter['$text'] = {
        $search: title
      }
    }

    if (type) {
      filter['type'] = type
    }

    return this.courseRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  async listByStaff(
    pagination: PaginationParams,
    queryCourseDto: StaffQueryCourseDto,
    projection = COURSE_LIST_PROJECTION
  ) {
    const { title, type, level, status } = queryCourseDto
    const filter: Record<string, any> = {
      status: {
        $in: [CourseStatus.ACTIVE]
      },
      childCourseIds: []
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      filter['level'] = {
        $in: validLevel
      }
    }

    const validStatus = status?.filter((status) => [CourseStatus.ACTIVE].includes(status))
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    if (title) {
      filter['$text'] = {
        $search: title
      }
    }

    if (type) {
      filter['type'] = type
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

  async listPublicCourses(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto) {
    const { title, type, level, fromPrice, toPrice } = queryCourseDto
    const { sort, limit, page } = pagination
    const aggregateMatch = []

    if (title?.trim()) {
      aggregateMatch.push({
        $match: {
          $text: {
            $search: title.trim()
          }
        }
      })
    }

    if (type?.trim()) {
      aggregateMatch.push({
        $match: {
          type: {
            $all: type.trim().split(', ')
          }
        }
      })
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      aggregateMatch.push({
        $match: {
          level: {
            $in: validLevel
          }
        }
      })
    }

    if (fromPrice !== undefined && toPrice !== undefined) {
      aggregateMatch.push({
        $match: {
          price: {
            $gte: fromPrice,
            $lte: toPrice
          }
        }
      })
    }
    aggregateMatch.push({
      $match: {
        childCourseIds: []
      }
    })

    const result = await this.courseRepository.model.aggregate([
      ...aggregateMatch,
      {
        $project: {
          _id: 1,
          code: 1,
          title: 1,
          price: 1,
          level: 1,
          type: 1,
          duration: 1,
          thumbnail: 1,
          status: 1,
          learnerLimit: 1,
          rate: 1,
          discount: 1,
          instructorId: 1,
          isRequesting: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: 'courseId',
          as: 'classes',
          pipeline: [
            {
              $match: {
                status: ClassStatus.PUBLISHED
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          classes: {
            $exists: true,
            $ne: []
          }
        }
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructors',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                idCardPhoto: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          instructor: {
            $arrayElemAt: ['$instructors', 0]
          },
          classesCount: {
            $reduce: {
              input: {
                $ifNull: ['$classes', []]
              },
              initialValue: 0,
              in: {
                $add: ['$$value', 1]
              }
            }
          }
        }
      },
      {
        $project: {
          classes: 0,
          instructors: 0
        }
      },
      {
        $sort: sort
      },
      {
        $facet: {
          list: [
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          count: [
            {
              $count: 'totalDocs'
            }
          ]
        }
      }
    ])

    const totalDocs = _.get(result, '[0].count[0].totalDocs', 0)
    return this.helperService.convertDataToPaging({
      docs: result[0].list,
      totalDocs,
      limit,
      page
    })
  }

  async listByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth) {
    const { title, type, level, fromPrice, toPrice } = queryCourseDto
    const { sort, limit, page } = pagination
    const aggregateMatch = []

    if (title?.trim()) {
      aggregateMatch.push({
        $match: {
          $text: {
            $search: title.trim()
          }
        }
      })
    }

    if (type?.trim()) {
      aggregateMatch.push({
        $match: {
          type: {
            $all: type.trim().split(', ')
          }
        }
      })
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      aggregateMatch.push({
        $match: {
          level: {
            $in: validLevel
          }
        }
      })
    }

    if (fromPrice !== undefined && toPrice !== undefined) {
      aggregateMatch.push({
        $match: {
          price: {
            $gte: fromPrice,
            $lte: toPrice
          }
        }
      })
    }
    aggregateMatch.push({
      $match: {
        childCourseIds: []
      }
    })

    const { _id: learnerId } = userAuth || {}
    const learnerClasses = await this.learnerClassService.findMany({
      learnerId: new Types.ObjectId(learnerId)
    })
    const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()))

    const result = await this.courseRepository.model.aggregate([
      ...aggregateMatch,
      {
        $project: {
          _id: 1,
          code: 1,
          title: 1,
          price: 1,
          level: 1,
          type: 1,
          duration: 1,
          thumbnail: 1,
          status: 1,
          learnerLimit: 1,
          rate: 1,
          discount: 1,
          instructorId: 1,
          isRequesting: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: 'courseId',
          as: 'classes',
          pipeline: [
            {
              $match: {
                status: ClassStatus.PUBLISHED
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          classes: {
            $exists: true,
            $ne: []
          }
        }
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructors',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                idCardPhoto: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          instructor: {
            $arrayElemAt: ['$instructors', 0]
          },
          classesCount: {
            $reduce: {
              input: {
                $ifNull: ['$classes', []]
              },
              initialValue: 0,
              in: {
                $add: ['$$value', 1]
              }
            }
          }
        }
      },
      {
        $project: {
          classes: 0,
          instructors: 0
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'childCourseIds',
          as: 'combos',
          let: { childCourseId: '$_id' },
          pipeline: [
            { $match: { status: CourseStatus.ACTIVE } },
            {
              $project: {
                childCourseIds: 1,
                discount: 1
              }
            }
          ]
        }
      },
      {
        $sort: sort
      },
      {
        $facet: {
          list: [
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          count: [
            {
              $count: 'totalDocs'
            }
          ]
        }
      }
    ])

    const totalDocs = _.get(result, '[0].count[0].totalDocs', 0)

    const docs = []
    for (const course of result[0].list) {
      const combos = _.get(course, 'combos') as Course[]
      let discount = 0
      if (combos.length !== 0) {
        const clonedCourseIdSet = new Set([...learnedCourseIdSet])
        clonedCourseIdSet.delete(course._id.toString())
        for (const combo of combos) {
          const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
            return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString())
          })
          if (matchedCourseIds.length > 0) {
            const newDiscount = combo.discount
            discount = newDiscount > discount ? newDiscount : discount
          }
        }
      }
      _.set(course, 'discount', discount)
      _.set(course, 'finalPrice', Math.round((_.get(course, 'price') * (100 - discount)) / 100))
      _.unset(course, 'combos')
      docs.push(course)
    }

    return this.helperService.convertDataToPaging({
      docs: result[0].list,
      totalDocs,
      limit,
      page
    })
  }

  async listBestSellerCoursesByLearner(
    pagination: PaginationParams,
    queryCourseDto: PublicQueryCourseDto,
    userAuth: UserAuth
  ) {
    const { title, type, level, fromPrice, toPrice } = queryCourseDto
    const { limit, page } = pagination
    const sort = {
      learnerQuantity: -1,
      createdAt: -1
    }
    const aggregateMatch = []

    if (title?.trim()) {
      aggregateMatch.push({
        $match: {
          $text: {
            $search: title.trim()
          }
        }
      })
    }

    if (type?.trim()) {
      aggregateMatch.push({
        $match: {
          type: {
            $all: type.trim().split(', ')
          }
        }
      })
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      aggregateMatch.push({
        $match: {
          level: {
            $in: validLevel
          }
        }
      })
    }

    if (fromPrice !== undefined && toPrice !== undefined) {
      aggregateMatch.push({
        $match: {
          price: {
            $gte: fromPrice,
            $lte: toPrice
          }
        }
      })
    }
    aggregateMatch.push({
      $match: {
        childCourseIds: []
      }
    })

    const { _id: learnerId } = userAuth || {}
    const learnerClasses = await this.learnerClassService.findMany({
      learnerId: new Types.ObjectId(learnerId)
    })
    const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()))

    const result = await this.courseRepository.model.aggregate([
      ...aggregateMatch,
      {
        $project: {
          _id: 1,
          code: 1,
          title: 1,
          price: 1,
          level: 1,
          type: 1,
          duration: 1,
          thumbnail: 1,
          status: 1,
          learnerLimit: 1,
          learnerQuantity: 1,
          rate: 1,
          discount: 1,
          instructorId: 1,
          isRequesting: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: 'courseId',
          as: 'classes',
          pipeline: [
            {
              $match: {
                status: ClassStatus.PUBLISHED
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          classes: {
            $exists: true,
            $ne: []
          }
        }
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructors',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                idCardPhoto: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          instructor: {
            $arrayElemAt: ['$instructors', 0]
          },
          classesCount: {
            $reduce: {
              input: {
                $ifNull: ['$classes', []]
              },
              initialValue: 0,
              in: {
                $add: ['$$value', 1]
              }
            }
          }
        }
      },
      {
        $project: {
          classes: 0,
          instructors: 0
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'childCourseIds',
          as: 'combos',
          let: { childCourseId: '$_id' },
          pipeline: [
            { $match: { status: CourseStatus.ACTIVE } },
            {
              $project: {
                childCourseIds: 1,
                discount: 1
              }
            }
          ]
        }
      },
      {
        $sort: sort
      },
      {
        $facet: {
          list: [
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          count: [
            {
              $count: 'totalDocs'
            }
          ]
        }
      }
    ])

    const totalDocs = _.get(result, '[0].count[0].totalDocs', 0)

    const docs = []
    for (const course of result[0].list) {
      const combos = _.get(course, 'combos') as Course[]
      let discount = 0
      if (combos.length !== 0) {
        const clonedCourseIdSet = new Set([...learnedCourseIdSet])
        clonedCourseIdSet.delete(course._id.toString())
        for (const combo of combos) {
          const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
            return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString())
          })
          if (matchedCourseIds.length > 0) {
            const newDiscount = combo.discount
            discount = newDiscount > discount ? newDiscount : discount
          }
        }
      }
      _.set(course, 'discount', discount)
      _.set(course, 'finalPrice', Math.round((_.get(course, 'price') * (100 - discount)) / 100))
      _.unset(course, 'combos')
      docs.push(course)
    }

    return this.helperService.convertDataToPaging({
      docs: result[0].list,
      totalDocs,
      limit,
      page
    })
  }

  async listRecommendedCoursesByLearner(
    pagination: PaginationParams,
    queryCourseDto: PublicQueryCourseDto,
    userAuth: UserAuth
  ) {
    const { title, type, level, fromPrice, toPrice } = queryCourseDto
    const { limit, page } = pagination
    const sort = {
      'combos.discount': -1,
      createdAt: -1
    }
    const aggregateMatch = []

    if (title?.trim()) {
      aggregateMatch.push({
        $match: {
          $text: {
            $search: title.trim()
          }
        }
      })
    }

    if (type?.trim()) {
      aggregateMatch.push({
        $match: {
          type: {
            $all: type.trim().split(', ')
          }
        }
      })
    }

    const validLevel = level?.filter((level) =>
      [CourseLevel.BASIC, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED].includes(level)
    )
    if (validLevel?.length > 0) {
      aggregateMatch.push({
        $match: {
          level: {
            $in: validLevel
          }
        }
      })
    }

    if (fromPrice !== undefined && toPrice !== undefined) {
      aggregateMatch.push({
        $match: {
          price: {
            $gte: fromPrice,
            $lte: toPrice
          }
        }
      })
    }
    aggregateMatch.push({
      $match: {
        childCourseIds: []
      }
    })

    const { _id: learnerId } = userAuth || {}
    const learnerClasses = await this.learnerClassService.findMany({
      learnerId: new Types.ObjectId(learnerId)
    })
    const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()))

    const result = await this.courseRepository.model.aggregate([
      ...aggregateMatch,
      {
        $project: {
          _id: 1,
          code: 1,
          title: 1,
          price: 1,
          level: 1,
          type: 1,
          duration: 1,
          thumbnail: 1,
          status: 1,
          learnerLimit: 1,
          learnerQuantity: 1,
          rate: 1,
          discount: 1,
          instructorId: 1,
          isRequesting: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: 'courseId',
          as: 'classes',
          pipeline: [
            {
              $match: {
                status: ClassStatus.PUBLISHED
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          classes: {
            $exists: true,
            $ne: []
          }
        }
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructors',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                idCardPhoto: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          instructor: {
            $arrayElemAt: ['$instructors', 0]
          },
          classesCount: {
            $reduce: {
              input: {
                $ifNull: ['$classes', []]
              },
              initialValue: 0,
              in: {
                $add: ['$$value', 1]
              }
            }
          }
        }
      },
      {
        $project: {
          classes: 0,
          instructors: 0
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'childCourseIds',
          as: 'combos',
          let: { childCourseId: '$_id' },
          pipeline: [
            { $match: { status: CourseStatus.ACTIVE } },
            {
              $project: {
                childCourseIds: 1,
                discount: 1
              }
            }
          ]
        }
      },
      {
        $sort: sort
      },
      {
        $facet: {
          list: [
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          count: [
            {
              $count: 'totalDocs'
            }
          ]
        }
      }
    ])

    const totalDocs = _.get(result, '[0].count[0].totalDocs', 0)

    const docs = []
    for (const course of result[0].list) {
      const combos = _.get(course, 'combos') as Course[]
      let discount = 0
      if (combos.length !== 0) {
        const clonedCourseIdSet = new Set([...learnedCourseIdSet])
        clonedCourseIdSet.delete(course._id.toString())
        for (const combo of combos) {
          const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
            return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString())
          })
          if (matchedCourseIds.length > 0) {
            const newDiscount = combo.discount
            discount = newDiscount > discount ? newDiscount : discount
          }
        }
      }
      _.set(course, 'discount', discount)
      _.set(course, 'finalPrice', Math.round((_.get(course, 'price') * (100 - discount)) / 100))
      _.unset(course, 'combos')
      docs.push(course)
    }

    docs.sort((courseA, courseB) => courseB['discount'] - courseA['discount'])

    return this.helperService.convertDataToPaging({
      docs: result[0].list,
      totalDocs,
      limit,
      page
    })
  }

  async findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]> {
    const courses = await this.courseRepository.findMany({
      conditions: {
        status: {
          $in: status
        },
        childCourseIds: []
      }
    })
    return courses
  }

  public async findMany(
    conditions: FilterQuery<CourseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const courses = await this.courseRepository.findMany({
      conditions: {
        ...conditions,
        childCourseIds: []
      },
      projection,
      populates
    })
    return courses
  }

  async viewReportCourseByRate() {
    return this.courseRepository.model.aggregate([
      {
        $match: {
          status: CourseStatus.ACTIVE,
          childCourseIds: []
        }
      },
      {
        $bucket: {
          groupBy: '$rate',
          boundaries: [0, 1, 2, 3, 4, 5.1]
        }
      }
    ])
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
