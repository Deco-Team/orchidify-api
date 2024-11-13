import { Controller, Get, Inject, Param, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ICertificateService } from '@certificate/services/certificate.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import {
  CertificateDetailDataResponse,
  CertificateListDataResponse,
  QueryCertificateDto
} from '@certificate/dto/view-certificate.dto'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Errors } from '@common/contracts/error'
import { CERTIFICATE_DETAIL_PROJECTION } from '@certificate/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'

@ApiTags('Certificate - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learners')
export class LearnerCertificateController {
  constructor(
    @Inject(ICertificateService)
    private readonly certificateService: ICertificateService
  ) {}

  @ApiOperation({
    summary: `View Certification List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: CertificateListDataResponse })
  @Get()
  async list(@Req() req, @Pagination() pagination: PaginationParams, @Query() queryStaffDto: QueryCertificateDto) {
    const { _id } = _.get(req, 'user')
    queryStaffDto.ownerId = _id
    pagination.limit = 99
    return await this.certificateService.list(pagination, queryStaffDto)
  }

  @ApiOperation({
    summary: `View Certification Detail`
  })
  @ApiOkResponse({ type: CertificateDetailDataResponse })
  @ApiErrorResponse([Errors.CERTIFICATE_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Req() req, @Param('id') certificateId: string) {
    const { _id } = _.get(req, 'user')
    const certificate = await this.certificateService.findById(certificateId, CERTIFICATE_DETAIL_PROJECTION)

    if (!certificate || certificate.ownerId.toString() !== _id) throw new AppException(Errors.CERTIFICATE_NOT_FOUND)
    return certificate
  }
}
