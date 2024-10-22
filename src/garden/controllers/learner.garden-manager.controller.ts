import { Controller, Get, UseGuards, Inject, Param } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IGardenService } from '@garden/services/garden.service'
import { GardenDetailDataResponse } from '@garden/dto/view-garden.dto'
import { GARDEN_DETAIL_PROJECTION } from '@garden/contracts/constant'

@ApiTags('Garden - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learner')
export class LearnerGardenController {
  constructor(
    @Inject(IGardenService)
    private readonly gardenService: IGardenService,
  ) {}

  @ApiOperation({
    summary: `View Garden Detail`
  })
  @ApiOkResponse({ type: GardenDetailDataResponse })
  @ApiErrorResponse([Errors.GARDEN_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') gardenId: string) {
    const garden = await this.gardenService.findById(gardenId, GARDEN_DETAIL_PROJECTION)
    if (!garden) throw new AppException(Errors.GARDEN_NOT_FOUND)
      
    return garden
  }
}