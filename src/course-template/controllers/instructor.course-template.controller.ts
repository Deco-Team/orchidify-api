import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Req, Delete } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse,
  IDDataResponse,
  IDResponse,
  PaginationQuery,
  SuccessDataResponse,
  SuccessResponse
} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { CourseStatus, CourseTemplateStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { Types } from 'mongoose'
import { ViewAssignmentDetailDataResponse } from '@course/dto/view-assignment.dto'
import { ICourseTemplateService } from '@course-template/services/course-template.service'
import { ITemplateLessonService } from '@course-template/services/template-lesson.service'
import { ITemplateAssignmentService } from '@course-template/services/template-assignment.service'
import {
  InstructorViewCourseTemplateDetailDataResponse,
  InstructorViewCourseTemplateListDataResponse,
  QueryCourseTemplateDto
} from '@course-template/dto/view-course-template.dto'
import { INSTRUCTOR_VIEW_COURSE_TEMPLATE_DETAIL_PROJECTION } from '@course-template/contracts/constant'
import { ViewTemplateLessonDetailDataResponse } from '@course-template/dto/view-template-lesson.dto'
import { CreateCourseTemplateDto } from '@course-template/dto/create-course-template.dto'
import { UpdateCourseTemplateDto } from '@course-template/dto/update-course-template.dto'

@ApiTags('CourseTemplate - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorCourseTemplateController {
  constructor(
    @Inject(ICourseTemplateService)
    private readonly courseTemplateService: ICourseTemplateService,
    @Inject(ITemplateLessonService)
    private readonly templateLessonService: ITemplateLessonService,
    @Inject(ITemplateAssignmentService)
    private readonly templateAssignmentService: ITemplateAssignmentService
  ) {}

  @ApiOperation({
    summary: `View Course Template List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorViewCourseTemplateListDataResponse })
  @Get()
  async list(
    @Req() req,
    @Pagination() pagination: PaginationParams,
    @Query() queryCourseTemplateDto: QueryCourseTemplateDto
  ) {
    const { _id } = _.get(req, 'user')
    return await this.courseTemplateService.listByInstructor(_id, pagination, queryCourseTemplateDto)
  }

  @ApiOperation({
    summary: `View Course Template Detail`
  })
  @ApiOkResponse({ type: InstructorViewCourseTemplateDetailDataResponse })
  @ApiErrorResponse([Errors.COURSE_TEMPLATE_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') courseTemplateId: string) {
    const { _id } = _.get(req, 'user')
    const courseTemplate = await this.courseTemplateService.findById(
      courseTemplateId,
      INSTRUCTOR_VIEW_COURSE_TEMPLATE_DETAIL_PROJECTION
    )

    if (!courseTemplate || courseTemplate.instructorId?.toString() !== _id)
      throw new AppException(Errors.COURSE_TEMPLATE_NOT_FOUND)
    return courseTemplate
  }

  @ApiOperation({
    summary: `View Course Template Lesson Detail`
  })
  @ApiOkResponse({ type: ViewTemplateLessonDetailDataResponse })
  @ApiErrorResponse([Errors.LESSON_NOT_FOUND])
  @Get(':courseTemplateId([0-9a-f]{24})/lessons/:lessonId([0-9a-f]{24})')
  async getLessonDetail(
    @Req() req,
    @Param('courseTemplateId') courseTemplateId: string,
    @Param('lessonId') lessonId: string
  ) {
    const { _id: instructorId } = _.get(req, 'user')
    const lesson = await this.templateLessonService.findOneBy({ lessonId, courseTemplateId, instructorId })

    if (!lesson) throw new AppException(Errors.LESSON_NOT_FOUND)
    return lesson
  }

  @ApiOperation({
    summary: `View Course Template Assignment Detail`
  })
  @ApiOkResponse({ type: ViewAssignmentDetailDataResponse })
  @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
  @Get(':courseTemplateId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
  async getAssignmentDetail(
    @Req() req,
    @Param('courseTemplateId') courseTemplateId: string,
    @Param('assignmentId') assignmentId: string
  ) {
    const { _id: instructorId } = _.get(req, 'user')
    const assignment = await this.templateAssignmentService.findOneBy({ assignmentId, courseTemplateId, instructorId })

    if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
    return assignment
  }

  @ApiOperation({
    summary: `Create ${CourseTemplateStatus.DRAFT} Course`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @Post()
  async create(@Req() req, @Body() createCourseTemplateDto: CreateCourseTemplateDto) {
    const { _id } = _.get(req, 'user')
    createCourseTemplateDto['status'] = CourseTemplateStatus.DRAFT
    createCourseTemplateDto['instructorId'] = new Types.ObjectId(_id)
    const courseTemplate = await this.courseTemplateService.create(createCourseTemplateDto)
    return new IDResponse(courseTemplate._id)
  }

  @ApiOperation({
    summary: `Update ${CourseTemplateStatus.DRAFT} Template Course`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_TEMPLATE_NOT_FOUND])
  @Put(':id([0-9a-f]{24})')
  async update(
    @Req() req,
    @Param('id') courseTemplateId: string,
    @Body() updateCourseTemplateDto: UpdateCourseTemplateDto
  ) {
    const { _id } = _.get(req, 'user')
    const courseTemplate = await this.courseTemplateService.update(
      { _id: courseTemplateId, status: CourseTemplateStatus.DRAFT, instructorId: new Types.ObjectId(_id) },
      updateCourseTemplateDto
    )

    if (!courseTemplate) throw new AppException(Errors.COURSE_TEMPLATE_NOT_FOUND)
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `Delete ${CourseTemplateStatus.DRAFT} Template Course`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.COURSE_TEMPLATE_NOT_FOUND])
  @Delete(':id([0-9a-f]{24})')
  async delete(@Req() req, @Param('id') courseTemplateId: string) {
    const { _id } = _.get(req, 'user')
    const courseTemplate = await this.courseTemplateService.update(
      { _id: courseTemplateId, status: CourseTemplateStatus.DRAFT, instructorId: new Types.ObjectId(_id) },
      { status: CourseTemplateStatus.DELETED }
    )

    if (!courseTemplate) throw new AppException(Errors.COURSE_TEMPLATE_NOT_FOUND)
    return new SuccessResponse(true)
  }
}
