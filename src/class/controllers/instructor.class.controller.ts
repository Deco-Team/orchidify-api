// import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Req, Delete } from '@nestjs/common'
// import {
//   ApiBadRequestResponse,
//   ApiBearerAuth,
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiOperation,
//   ApiQuery,
//   ApiTags
// } from '@nestjs/swagger'
// import * as _ from 'lodash'

// import {
//   ErrorResponse,
//   IDDataResponse,
//   IDResponse,
//   PaginationQuery,
//   SuccessDataResponse,
//   SuccessResponse
// } from '@common/contracts/dto'
// import { Roles } from '@auth/decorators/roles.decorator'
// import { ClassStatus, UserRole } from '@common/contracts/constant'
// import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
// import { RolesGuard } from '@auth/guards/roles.guard'
// import { AppException } from '@common/exceptions/app.exception'
// import { Errors } from '@common/contracts/error'
// import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
// import { IClassService } from '@class/services/class.service'
// import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
// import { CreateClassDto } from '@class/dto/create-class.dto'
// import { UpdateClassDto } from '@class/dto/update-class.dto'
// import {
//   InstructorViewClassDetailDataResponse,
//   InstructorViewClassListDataResponse,
//   QueryClassDto
// } from '@class/dto/view-class.dto'
// import { INSTRUCTOR_VIEW_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
// import { Types } from 'mongoose'
// import { ILessonService } from '@class/services/lesson.service'
// import { ViewLessonDetailDataResponse } from '@class/dto/view-lesson.dto'
// import { IAssignmentService } from '@class/services/assignment.service'
// import { ViewAssignmentDetailDataResponse } from '@class/dto/view-assignment.dto'

// @ApiTags('Class - Instructor')
// @ApiBearerAuth()
// @ApiBadRequestResponse({ type: ErrorResponse })
// @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
// @Roles(UserRole.INSTRUCTOR)
// @Controller('instructor')
// export class InstructorClassController {
//   constructor(
//     @Inject(IClassService)
//     private readonly classService: IClassService,
//     @Inject(ILessonService)
//     private readonly lessonService: ILessonService,
//     @Inject(IAssignmentService)
//     private readonly assignmentService: IAssignmentService
//   ) {}

//   @ApiOperation({
//     summary: `View Class List`
//   })
//   @ApiQuery({ type: PaginationQuery })
//   @ApiOkResponse({ type: InstructorViewClassListDataResponse })
//   @Get()
//   async list(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryClassDto: QueryClassDto) {
//     const { _id } = _.get(req, 'user')
//     return await this.classService.listByInstructor(_id, pagination, queryClassDto)
//   }

//   @ApiOperation({
//     summary: `View Class Detail`
//   })
//   @ApiOkResponse({ type: InstructorViewClassDetailDataResponse })
//   @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
//   @Get(':id([0-9a-f]{24})')
//   async getDetail(@Req() req, @Param('id') classId: string) {
//     const { _id } = _.get(req, 'user')
//     const courseClass = await this.classService.findById(classId, INSTRUCTOR_VIEW_CLASS_DETAIL_PROJECTION)

//     if (!courseClass || courseClass.instructorId?.toString() !== _id) throw new AppException(Errors.CLASS_NOT_FOUND)
//     return courseClass
//   }

//   @ApiOperation({
//     summary: `View Lesson Detail`
//   })
//   @ApiOkResponse({ type: ViewLessonDetailDataResponse })
//   @ApiErrorResponse([Errors.SESSION_NOT_FOUND])
//   @Get(':classId([0-9a-f]{24})/lessons/:lessonId([0-9a-f]{24})')
//   async getLessonDetail(@Req() req, @Param('classId') classId: string, @Param('lessonId') lessonId: string) {
//     const { _id: instructorId } = _.get(req, 'user')
//     const lesson = await this.lessonService.findOneBy({ lessonId, classId, instructorId })

//     if (!lesson) throw new AppException(Errors.SESSION_NOT_FOUND)
//     return lesson
//   }

//   @ApiOperation({
//     summary: `View Assignment Detail`
//   })
//   @ApiOkResponse({ type: ViewAssignmentDetailDataResponse })
//   @ApiErrorResponse([Errors.ASSIGNMENT_NOT_FOUND])
//   @Get(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})')
//   async getAssignmentDetail(
//     @Req() req,
//     @Param('classId') classId: string,
//     @Param('assignmentId') assignmentId: string
//   ) {
//     const { _id: instructorId } = _.get(req, 'user')
//     const assignment = await this.assignmentService.findOneBy({ assignmentId, classId, instructorId })

//     if (!assignment) throw new AppException(Errors.ASSIGNMENT_NOT_FOUND)
//     return assignment
//   }

//   @ApiOperation({
//     summary: `Create ${ClassStatus.DRAFT} Class`
//   })
//   @ApiCreatedResponse({ type: IDDataResponse })
//   @Post()
//   async create(@Req() req, @Body() createClassDto: CreateClassDto) {
//     const { _id } = _.get(req, 'user')
//     createClassDto['status'] = ClassStatus.DRAFT
//     createClassDto['histories'] = [
//       {
//         status: ClassStatus.DRAFT,
//         timestamp: new Date(),
//         userId: new Types.ObjectId(_id),
//         userRole: UserRole.INSTRUCTOR
//       }
//     ]
//     createClassDto['instructorId'] = new Types.ObjectId(_id)
//     const courseClass = await this.classService.create(createClassDto)
//     return new IDResponse(courseClass._id)
//   }

//   @ApiOperation({
//     summary: `Update ${ClassStatus.DRAFT} Class`
//   })
//   @ApiOkResponse({ type: SuccessDataResponse })
//   @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
//   @Put(':id([0-9a-f]{24})')
//   async update(@Req() req, @Param('id') classId: string, @Body() updateClassDto: UpdateClassDto) {
//     const { _id } = _.get(req, 'user')
//     const courseClass = await this.classService.update(
//       { _id: classId, status: ClassStatus.DRAFT, instructorId: new Types.ObjectId(_id) },
//       updateClassDto
//     )

//     if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)
//     return new SuccessResponse(true)
//   }

//   @ApiOperation({
//     summary: `Delete ${ClassStatus.DRAFT} Class`
//   })
//   @ApiOkResponse({ type: SuccessDataResponse })
//   @ApiErrorResponse([Errors.CLASS_NOT_FOUND])
//   @Delete(':id([0-9a-f]{24})')
//   async delete(@Req() req, @Param('id') classId: string) {
//     const { _id } = _.get(req, 'user')
//     const courseClass = await this.classService.update(
//       { _id: classId, status: ClassStatus.DRAFT, instructorId: new Types.ObjectId(_id) },
//       { status: ClassStatus.DELETED }
//     )

//     if (!courseClass) throw new AppException(Errors.CLASS_NOT_FOUND)
//     return new SuccessResponse(true)
//   }
// }
