import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IGardenRepository } from '@garden/repositories/garden.repository'
import { Garden, GardenDocument } from '@garden/schemas/garden.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateGardenDto } from '@garden/dto/create-garden.dto'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { QueryGardenDto } from '@garden/dto/view-garden.dto'
import { GARDEN_LIST_PROJECTION } from '@garden/contracts/constant'
import { GardenStatus } from '@common/contracts/constant'
import { MongoServerError } from 'mongodb'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { AvailableGardenListItemResponse, QueryAvailableGardenDto } from '@garden/dto/view-available-garden.dto'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { AppLogger } from '@common/services/app-logger.service'

export const IGardenService = Symbol('IGardenService')

export interface IGardenService {
  create(createGardenDto: CreateGardenDto, options?: SaveOptions | undefined): Promise<GardenDocument>
  findById(
    gardenId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<GardenDocument>
  update(
    conditions: FilterQuery<Garden>,
    payload: UpdateQuery<Garden>,
    options?: QueryOptions | undefined
  ): Promise<GardenDocument>
  findManyByGardenManagerId(gardenManagerId: string): Promise<GardenDocument[]>
  list(
    pagination: PaginationParams,
    queryGardenDto: QueryGardenDto,
    projection?: string | Record<string, any>,
    populate?: Array<PopulateOptions>
  )
  getAvailableGardenList(queryAvailableGardenDto: QueryAvailableGardenDto): Promise<AvailableGardenListItemResponse[]>
}

@Injectable()
export class GardenService implements IGardenService {
  private readonly appLogger = new AppLogger(GardenService.name)
  constructor(
    @Inject(IGardenRepository)
    private readonly gardenRepository: IGardenRepository,
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService
  ) {}

  public async create(createGardenDto: CreateGardenDto, options?: SaveOptions | undefined) {
    try {
      return await this.gardenRepository.create(
        { ...createGardenDto, gardenManagerId: new Types.ObjectId(createGardenDto.gardenManagerId) },
        options
      )
    } catch (error) {
      if (error.name === MongoServerError.name && error.code === 11000 && error.keyPattern?.['name'] === 1) {
        throw new AppException(Errors.GARDEN_NAME_EXISTED)
      }
      throw error
    }
  }

  public async findById(
    gardenId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const garden = await this.gardenRepository.findOne({
      conditions: {
        _id: gardenId
      },
      projection,
      populates
    })
    return garden
  }

  public async update(
    conditions: FilterQuery<Garden>,
    payload: UpdateQuery<Garden>,
    options?: QueryOptions | undefined
  ) {
    try {
      if (payload.gardenManagerId) {
        payload.gardenManagerId = new Types.ObjectId(payload.gardenManagerId)
      }
      return await this.gardenRepository.findOneAndUpdate(conditions, payload, options)
    } catch (error) {
      if (error.name === MongoServerError.name && error.name === 11000 && error.name?.['name'] === 1) {
        throw new AppException(Errors.GARDEN_NAME_EXISTED)
      }
      throw error
    }
  }

  async findManyByGardenManagerId(gardenManagerId: string): Promise<GardenDocument[]> {
    const gardens = await this.gardenRepository.findMany({
      conditions: {
        gardenManagerId
      }
    })
    return gardens
  }

  async list(
    pagination: PaginationParams,
    queryCourseDto: QueryGardenDto,
    projection = GARDEN_LIST_PROJECTION,
    populate?: Array<PopulateOptions>
  ) {
    const { name, address, status, gardenManagerId } = queryCourseDto
    const filter: Record<string, any> = {}
    if (gardenManagerId) {
      filter['gardenManagerId'] = gardenManagerId
    }

    const validStatus = status?.filter((status) => [GardenStatus.ACTIVE, GardenStatus.INACTIVE].includes(status))
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    let textSearch = ''
    if (name) textSearch += name.trim()
    if (address) textSearch += ' ' + address.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch.trim()
      }
    }

    return this.gardenRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate
    })
  }

  async getAvailableGardenList(
    queryAvailableGardenDto: QueryAvailableGardenDto
  ): Promise<AvailableGardenListItemResponse[]> {
    const { startDate, duration, weekdays, slotNumbers, instructorId } = queryAvailableGardenDto
    const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
      startDate,
      duration,
      weekdays,
      instructorId
    })
    this.appLogger.log(
      `getAvailableGardenList: slotNumbers=${slotNumbers}, availableSlotNumbers=${
        availableSlots.slotNumbers
      }, availableTimeOfGardens=${JSON.stringify(availableSlots.availableTimeOfGardens)}`
    )
    if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0) return []

    const availableGardens = availableSlots.availableTimeOfGardens.filter((availableTimeOfGarden) => {
      this.appLogger.log(`gardenId=${availableTimeOfGarden.gardenId}, slotNumbers=${availableTimeOfGarden.slotNumbers}`)
      return _.difference(slotNumbers, availableTimeOfGarden.slotNumbers).length === 0
    })
    if (availableGardens.length === 0) return []

    const gardenIds = availableGardens.map((availableGarden) => availableGarden.gardenId)
    const gardens = await this.gardenRepository.findMany({
      conditions: {
        _id: {
          $in: gardenIds
        },
        status: GardenStatus.ACTIVE
      },
      projection: ['_id', 'name']
    })
    return gardens
  }
}
