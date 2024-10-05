import { Controller, Get, UseGuards, Inject, Query, Param, Patch, Put, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { ClassStatus, InstructorStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IUserTokenService } from '@auth/services/user-token.service'
import { IInstructorService } from '@instructor/services/instructor.service'
import { INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import {
  InstructorDetailDataResponse,
  InstructorListDataResponse,
  QueryInstructorDto
} from '@instructor/dto/view-instructor.dto'
import { UpdateInstructorDto } from '@instructor/dto/update-instructor.dto'
import { Types } from 'mongoose'
import { IClassService } from '@src/class/services/class.service'

@ApiTags('Instructor - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementInstructorController {
  constructor(
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IClassService)
    private readonly classService: IClassService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Instructor List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: InstructorListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryInstructorDto: QueryInstructorDto) {
    return await this.instructorService.list(pagination, queryInstructorDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Instructor Detail`
  })
  @ApiOkResponse({ type: InstructorDetailDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') instructorId: string) {
    const instructor = await this.instructorService.findById(instructorId, INSTRUCTOR_DETAIL_PROJECTION)
    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)

    return instructor
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Update Instructor`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Put(':id([0-9a-f]{24})')
  async update(@Param('id') instructorId: string, @Body() updateInstructorDto: UpdateInstructorDto) {
    const instructor = await this.instructorService.update({ _id: instructorId }, updateInstructorDto)

    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Deactivate Instructor`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES])
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') instructorId: string) {
    // TODO: BR-21 Cannot deactivate an instructor whose class is published or in progress.
    const classes = await this.classService.findManyByInstructorIdAndStatus(instructorId, [
      ClassStatus.PUBLISHED,
      ClassStatus.IN_PROGRESS
    ])
    if (classes.length > 0) throw new AppException(Errors.INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES)

    await Promise.all([
      this.instructorService.update(
        {
          _id: instructorId
        },
        { status: InstructorStatus.INACTIVE }
      ),
      this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(instructorId), UserRole.INSTRUCTOR)
    ])
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Activate Instructor`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') instructorId: string) {
    await this.instructorService.update(
      {
        _id: instructorId
      },
      { status: InstructorStatus.ACTIVE }
    )
    return new SuccessResponse(true)
  }
}