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
import { CourseStatus, GardenManagerStatus, GardenStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IGardenService } from '@garden/services/garden.service'
import { GardenDetailDataResponse, GardenListDataResponse, QueryGardenDto } from '@garden/dto/view-garden.dto'
import { GARDEN_DETAIL_PROJECTION, GARDEN_LIST_PROJECTION } from '@garden/contracts/constant'
import { CreateGardenDto } from '@garden/dto/create-garden.dto'
import { UpdateGardenDto } from '@garden/dto/update-garden.dto'
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service'
import { ICourseService } from '@course/services/course.service'

@ApiTags('Garden - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class ManagementGardenController {
  constructor(
    @Inject(IGardenService)
    private readonly gardenService: IGardenService,
    @Inject(IGardenManagerService)
    private readonly gardenManagerService: IGardenManagerService,
    @Inject(ICourseService)
    private readonly courseService: ICourseService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Garden List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: GardenListDataResponse })
  @Roles(UserRole.STAFF)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryGardenDto: QueryGardenDto) {
    return await this.gardenService.list(pagination, queryGardenDto, GARDEN_LIST_PROJECTION, [
      {
        path: 'gardenManager',
        select: ['name']
      }
    ])
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Garden Detail`
  })
  @ApiOkResponse({ type: GardenDetailDataResponse })
  @ApiErrorResponse([Errors.GARDEN_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') gardenId: string) {
    const garden = await this.gardenService.findById(gardenId, GARDEN_DETAIL_PROJECTION, [
      {
        path: 'gardenManager',
        select: ['name']
      }
    ])

    if (!garden) throw new AppException(Errors.GARDEN_NOT_FOUND)
    return garden
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Add Garden`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([Errors.GARDEN_NAME_EXISTED, Errors.GARDEN_MANAGER_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Post()
  async create(@Body() createGardenDto: CreateGardenDto) {
    const gardenManager = await this.gardenManagerService.findById(createGardenDto.gardenManagerId)
    if (!gardenManager || gardenManager.status !== GardenManagerStatus.ACTIVE)
      throw new AppException(Errors.GARDEN_MANAGER_NOT_FOUND)

    const garden = await this.gardenService.create(createGardenDto)
    return new IDResponse(garden._id)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Update Garden`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.GARDEN_NOT_FOUND, Errors.GARDEN_NAME_EXISTED, Errors.GARDEN_MANAGER_NOT_FOUND])
  @Roles(UserRole.STAFF)
  @Put(':id([0-9a-f]{24})')
  async update(@Param('id') gardenId: string, @Body() updateGardenDto: UpdateGardenDto) {
    if (updateGardenDto.gardenManagerId) {
      const gardenManager = await this.gardenManagerService.findById(updateGardenDto.gardenManagerId)
      if (!gardenManager || gardenManager.status !== GardenManagerStatus.ACTIVE)
        throw new AppException(Errors.GARDEN_MANAGER_NOT_FOUND)
    }

    const garden = await this.gardenService.update({ _id: gardenId }, updateGardenDto)

    if (!garden) throw new AppException(Errors.GARDEN_NOT_FOUND)
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Deactivate Garden`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.SCHEDULED_OR_IN_PROGRESSING_COURSE_IN_GARDEN])
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') gardenId: string) {
    // BR-29: Garden can not be deactivated if there are any in-progressing or scheduled courses.
    const courses = await this.courseService.findManyByStatus([
      CourseStatus.PENDING,
      CourseStatus.PUBLISHED,
      CourseStatus.IN_PROGRESS
    ])
    if (courses.length > 0) throw new AppException(Errors.SCHEDULED_OR_IN_PROGRESSING_COURSE_IN_GARDEN)

    await this.gardenService.update(
      {
        _id: gardenId
      },
      { status: GardenStatus.INACTIVE }
    )
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Activate Garden`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.STAFF)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') gardenId: string) {
    await this.gardenService.update(
      {
        _id: gardenId
      },
      { status: GardenStatus.ACTIVE }
    )
    return new SuccessResponse(true)
  }
}
