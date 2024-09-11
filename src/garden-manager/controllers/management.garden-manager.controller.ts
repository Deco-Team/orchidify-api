import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Patch } from '@nestjs/common'
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
import { GardenManagerStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { CreateGardenManagerDto } from '@garden-manager/dto/create-garden-manager.dto'
import { UpdateGardenManagerDto } from '@garden-manager/dto/update-garden-manager.dto'
import {
  GardenManagerDetailDataResponse,
  GardenManagerListDataResponse,
  QueryGardenManagerDto
} from '@garden-manager/dto/view-garden-manager.dto'
import { GARDEN_MANAGER_DETAIL_PROJECTION } from '@garden-manager/contracts/constant'
import { IUserTokenService } from '@auth/services/user-token.service'
import { IGardenService } from '@garden/services/garden.service'
import { Types } from 'mongoose'

@ApiTags('Garden Manager')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class ManagementGardenManagerController {
  constructor(
    @Inject(IGardenManagerService)
    private readonly gardenManagerService: IGardenManagerService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IGardenService)
    private readonly gardenService: IGardenService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Garden Manager List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: GardenManagerListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryGardenManagerDto: QueryGardenManagerDto) {
    return await this.gardenManagerService.list(pagination, queryGardenManagerDto)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Garden Manager Detail`
  })
  @ApiOkResponse({ type: GardenManagerDetailDataResponse })
  @ApiErrorResponse([Errors.GARDEN_MANAGER_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') gardenManagerId: string) {
    const gardenManager = await this.gardenManagerService.findById(gardenManagerId, GARDEN_MANAGER_DETAIL_PROJECTION)

    if (!gardenManager) throw new AppException(Errors.GARDEN_MANAGER_NOT_FOUND)
    return gardenManager
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Add Garden Manager`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([Errors.EMAIL_ALREADY_EXIST])
  @Roles(UserRole.STAFF)
  @Post()
  async create(@Body() createGardenManagerDto: CreateGardenManagerDto) {
    const existedGardenManager = await this.gardenManagerService.findByEmail(createGardenManagerDto.email)
    if (existedGardenManager) throw new AppException(Errors.EMAIL_ALREADY_EXIST)
    const gardenManager = await this.gardenManagerService.create(createGardenManagerDto)
    return new IDResponse(gardenManager._id)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Update Garden Manager`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.GARDEN_MANAGER_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Put(':id([0-9a-f]{24})')
  async update(@Param('id') gardenManagerId: string, @Body() updateGardenManagerDto: UpdateGardenManagerDto) {
    const gardenManager = await this.gardenManagerService.update({ _id: gardenManagerId }, updateGardenManagerDto)

    if (!gardenManager) throw new AppException(Errors.GARDEN_MANAGER_NOT_FOUND)
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Deactivate Garden Manager`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN])
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') gardenManagerId: string) {
    // BR-30: If the garden manager is assigned to a garden, the garden manager cannot be deactivated.
    const gardens = await this.gardenService.findByGardenManagerId(gardenManagerId)
    if (gardens.length > 0) throw new AppException(Errors.GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN)

    await Promise.all([
      this.gardenManagerService.update(
        {
          _id: gardenManagerId
        },
        { status: GardenManagerStatus.INACTIVE }
      ),
      this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(gardenManagerId), UserRole.GARDEN_MANAGER)
    ])
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Activate Garden Manager`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') gardenManagerId: string) {
    await this.gardenManagerService.update(
      {
        _id: gardenManagerId
      },
      { status: GardenManagerStatus.ACTIVE }
    )
    return new SuccessResponse(true)
  }
}
