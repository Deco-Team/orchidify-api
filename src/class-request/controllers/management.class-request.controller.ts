import { Controller, Get, UseGuards, Inject, Query, Param, Patch, Req, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery, SuccessDataResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IClassRequestService } from '@class-request/services/class-request.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import {
  QueryClassRequestDto,
  StaffViewClassRequestDetailDataResponse,
  StaffViewClassRequestListDataResponse
} from '@class-request/dto/view-class-request.dto'
import { CLASS_REQUEST_DETAIL_PROJECTION, CLASS_REQUEST_LIST_PROJECTION } from '@class-request/contracts/constant'
import { RejectClassRequestDto } from '@class-request/dto/reject-class-request.dto'
import { ApproveClassRequestDto } from '@class-request/dto/approve-class-request.dto'

@ApiTags('ClassRequest - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementClassRequestController {
  constructor(
    @Inject(IClassRequestService)
    private readonly classRequestService: IClassRequestService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class Request List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: StaffViewClassRequestListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryClassRequestDto: QueryClassRequestDto) {
    return await this.classRequestService.list(pagination, queryClassRequestDto, CLASS_REQUEST_LIST_PROJECTION, [
      {
        path: 'createdBy',
        select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar']
      }
    ])
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class Request Detail`
  })
  @ApiOkResponse({ type: StaffViewClassRequestDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_REQUEST_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') classRequestId: string) {
    const classRequest = await this.classRequestService.findById(classRequestId, CLASS_REQUEST_DETAIL_PROJECTION, [
      {
        path: 'createdBy',
        select: ['_id', 'name', 'phone', 'email', 'idCardPhoto', 'avatar']
      },
      {
        path: 'class',
        populate: [
          {
            path: 'course',
            select: ['code']
          }
        ]
      }
    ])

    if (!classRequest) throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    return classRequest
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Approve Publish/Cancel Class Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.CLASS_REQUEST_NOT_FOUND,
    Errors.CLASS_REQUEST_STATUS_INVALID,
    Errors.COURSE_NOT_FOUND,
    Errors.COURSE_STATUS_INVALID,
    Errors.CLASS_STATUS_INVALID,
    Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST,
    Errors.CANCEL_CLASS_REQUEST_CAN_NOT_BE_APPROVED
  ])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/approve')
  async approve(
    @Req() req,
    @Param('id') classRequestId: string,
    @Body() approveClassRequestDto: ApproveClassRequestDto
  ) {
    const user = _.get(req, 'user')
    return this.classRequestService.approveClassRequest(classRequestId, approveClassRequestDto, user)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Reject Publish/Cancel Class Request`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.CLASS_REQUEST_NOT_FOUND,
    Errors.CLASS_REQUEST_STATUS_INVALID,
    Errors.COURSE_NOT_FOUND,
    Errors.COURSE_STATUS_INVALID,
    Errors.CLASS_NOT_FOUND
  ])
  @Roles(UserRole.STAFF)
  @Patch(':id([0-9a-f]{24})/reject')
  async reject(@Req() req, @Param('id') classRequestId: string, @Body() RejectClassRequestDto: RejectClassRequestDto) {
    const user = _.get(req, 'user')
    return this.classRequestService.rejectClassRequest(classRequestId, RejectClassRequestDto, user)
  }
}
