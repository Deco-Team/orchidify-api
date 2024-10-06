import { Controller, Get, UseGuards, Inject, Query, Param } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse,
  PaginationQuery} from '@common/contracts/dto'
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
  InstructorViewClassRequestDetailDataResponse,
  InstructorViewClassRequestListDataResponse,
  QueryClassRequestDto
} from '@class-request/dto/view-class-request.dto'
import { CLASS_REQUEST_DETAIL_PROJECTION } from '@class-request/contracts/constant'

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
  @ApiOkResponse({ type: InstructorViewClassRequestListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryClassRequestDto: QueryClassRequestDto) {
    return await this.classRequestService.list(pagination, queryClassRequestDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Class Request Detail`
  })
  @ApiOkResponse({ type: InstructorViewClassRequestDetailDataResponse })
  @ApiErrorResponse([Errors.CLASS_REQUEST_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') classRequestId: string) {
    const classRequest = await this.classRequestService.findById(classRequestId, CLASS_REQUEST_DETAIL_PROJECTION)

    if (!classRequest)
      throw new AppException(Errors.CLASS_REQUEST_NOT_FOUND)
    return classRequest
  }
}
