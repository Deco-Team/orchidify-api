import { Injectable, Inject } from '@nestjs/common'
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
}

@Injectable()
export class GardenService implements IGardenService {
  constructor(
    @Inject(IGardenRepository)
    private readonly gardenRepository: IGardenRepository
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
    const { name, address, status } = queryCourseDto
    const filter: Record<string, any> = {}

    const validStatus = status?.filter((status) => [GardenStatus.ACTIVE, GardenStatus.INACTIVE].includes(status))
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    return this.gardenRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate
    })
  }
}
