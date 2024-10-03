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
  PaginationQuery,
} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IRecruitmentService } from '@recruitment/services/recruitment.service'
import {
  RecruitmentDetailDataResponse,
  RecruitmentListDataResponse,
  QueryRecruitmentDto
} from '@recruitment/dto/view-recruitment.dto'
import { RECRUITMENT_DETAIL_PROJECTION } from '@recruitment/contracts/constant'

@ApiTags('Recruitment - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementRecruitmentController {
  constructor(
    @Inject(IRecruitmentService)
    private readonly recruitmentService: IRecruitmentService,
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Recruitment List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: RecruitmentListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryRecruitmentDto: QueryRecruitmentDto) {
    return await this.recruitmentService.list(pagination, queryRecruitmentDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Recruitment Detail`
  })
  @ApiOkResponse({ type: RecruitmentDetailDataResponse })
  @ApiErrorResponse([Errors.RECRUITMENT_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') recruitmentId: string) {
    const recruitment = await this.recruitmentService.findById(recruitmentId, RECRUITMENT_DETAIL_PROJECTION)
    if (!recruitment) throw new AppException(Errors.RECRUITMENT_NOT_FOUND)

    return recruitment
  }
}
