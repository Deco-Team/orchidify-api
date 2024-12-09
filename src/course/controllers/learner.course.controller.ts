import { Controller, Get, Inject, Query, Param, UseGuards, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { ClassStatus, CourseStatus, UserRole } from '@common/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { ICourseService } from '@course/services/course.service'
import {
  LearnerViewCourseDetailDataResponse,
  LearnerViewCourseListDataResponse,
  PublicCourseDetailDataResponse,
  PublicQueryCourseDto,
  PublishCourseListDataResponse
} from '@course/dto/view-course.dto'
import { PUBLIC_COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { PUBLIC_COURSE_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import { Types } from 'mongoose'
import { Course } from '@course/schemas/course.schema'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { MIN_PRICE } from '@src/config'

@ApiTags('Course - Viewer/Learner')
@ApiBadRequestResponse({ type: ErrorResponse })
@Controller()
export class CourseController {
  constructor(
    @Inject(ICourseService)
    private readonly courseService: ICourseService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
  ) {}

  @ApiOperation({
    summary: `[Viewer] View Public Course List`
  })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: PublishCourseListDataResponse })
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryCourseDto: PublicQueryCourseDto) {
    return await this.courseService.listPublicCourses(pagination, queryCourseDto)
  }

  @ApiOperation({
    summary: `[${UserRole.LEARNER}] View Course List`
  })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerViewCourseListDataResponse })
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  @Roles(UserRole.LEARNER)
  @Get('learner')
  async listForLearner(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryCourseDto: PublicQueryCourseDto
  ) {
    const userAuth = _.get(req, 'user')
    return await this.courseService.listByLearner(pagination, queryCourseDto, userAuth)
  }

  @ApiOperation({
    summary: `[${UserRole.LEARNER}] View Best Seller Course List`
  })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerViewCourseListDataResponse })
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  @Roles(UserRole.LEARNER)
  @Get('learner/best-seller')
  async listBestSellerCourseForLearner(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryCourseDto: PublicQueryCourseDto
  ) {
    const userAuth = _.get(req, 'user')
    return await this.courseService.listBestSellerCoursesByLearner(pagination, queryCourseDto, userAuth)
  }

  @ApiOperation({
    summary: `[${UserRole.LEARNER}] View Recommended Course List`
  })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerViewCourseListDataResponse })
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  @Roles(UserRole.LEARNER)
  @Get('learner/recommended')
  async listRecommendedCourseForLearner(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryCourseDto: PublicQueryCourseDto
  ) {
    const userAuth = _.get(req, 'user')
    return await this.courseService.listRecommendedCoursesByLearner(pagination, queryCourseDto, userAuth)
  }

  @ApiOperation({
    summary: `[${UserRole.LEARNER}] View Course Detail`
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: LearnerViewCourseDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  @Roles(UserRole.LEARNER)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') courseId: string) {
    const { _id: learnerId } = _.get(req, 'user')
    const [course, learnerClasses] = await Promise.all([
      this.courseService.findById(courseId, PUBLIC_COURSE_DETAIL_PROJECTION, [
        {
          path: 'classes',
          select: PUBLIC_COURSE_CLASS_DETAIL_PROJECTION,
          match: { status: ClassStatus.PUBLISHED },
          populate: [
            {
              path: 'learnerClass',
              select: ['_id'],
              match: { learnerId: new Types.ObjectId(learnerId) }
            },
            {
              path: 'garden',
              select: ['_id', 'name']
            }
          ]
        },
        {
          path: 'instructor',
          select: COURSE_INSTRUCTOR_DETAIL_PROJECTION
        },
        {
          path: 'combos',
          select: ['childCourseIds', 'discount'],
          match: { status: CourseStatus.ACTIVE }
        }
      ]),
      this.learnerClassService.findMany({
        learnerId: new Types.ObjectId(learnerId)
      })
    ])
    if (!course || [CourseStatus.ACTIVE].includes(course.status) === false)
      throw new AppException(Errors.COURSE_NOT_FOUND)

    const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()))

    const courseData = course.toObject()
    const combos = _.get(courseData, 'combos') as Course[]
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
    _.set(courseData, 'discount', discount)
    let finalPrice = Math.round((_.get(courseData, 'price') * (100 - discount)) / 100)
    finalPrice = finalPrice < MIN_PRICE ? MIN_PRICE : finalPrice
    _.set(courseData, 'finalPrice', finalPrice)
    _.unset(courseData, 'combos')

    return courseData
  }
}
