import { Injectable, Inject } from '@nestjs/common'
import { IGardenManagerRepository } from '@garden-manager/repositories/garden-manager.repository'
import { GardenManager, GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema'
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import { IAuthUserService } from '@auth/services/auth.service'
import { CreateGardenManagerDto } from '@garden-manager/dto/create-garden-manager.dto'
import { QueryGardenManagerDto } from '@garden-manager/dto/view-garden-manager.dto'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { GARDEN_MANAGER_LIST_PROJECTION } from '@garden-manager/contracts/constant'
import { GardenManagerStatus } from '@common/contracts/constant'
import { HelperService } from '@common/services/helper.service'
import { NotificationAdapter } from '@common/adapters/notification.adapter'

export const IGardenManagerService = Symbol('IGardenManagerService')

export interface IGardenManagerService extends IAuthUserService {
  create(gardenManager: CreateGardenManagerDto, options?: SaveOptions | undefined): Promise<GardenManagerDocument>
  findById(gardenManagerId: string, projection?: string | Record<string, any>): Promise<GardenManagerDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<GardenManagerDocument>
  update(
    conditions: FilterQuery<GardenManager>,
    payload: UpdateQuery<GardenManager>,
    options?: QueryOptions | undefined
  ): Promise<GardenManagerDocument>
  list(pagination: PaginationParams, queryGardenManagerDto: QueryGardenManagerDto)
}

@Injectable()
export class GardenManagerService implements IGardenManagerService {
  constructor(
    @Inject(IGardenManagerRepository)
    private readonly gardenManagerRepository: IGardenManagerRepository,
    private readonly helperService: HelperService,
    private readonly notificationAdapter: NotificationAdapter
  ) {}

  public async create(createGardenManagerDto: CreateGardenManagerDto, options?: SaveOptions | undefined) {
    const password = this.helperService.generateRandomString(10, 'abcdefghijklmnopqrstuvwxyz0123456789')
    const hashPassword = await this.helperService.hashPassword(password)
    createGardenManagerDto['password'] = hashPassword
    const gardenManager = await this.gardenManagerRepository.create(createGardenManagerDto, options)
    
    this.notificationAdapter.sendMail({
      to: gardenManager.email,
      subject: `[Orchidify] Login Information`,
      template: 'management/add-garden-manager',
      context: {
        email: gardenManager.email,
        name: gardenManager.name,
        password
      }
    })
    return gardenManager
  }

  public async findById(gardenManagerId: string, projection?: string | Record<string, any>) {
    const gardenManager = await this.gardenManagerRepository.findOne({
      conditions: {
        _id: gardenManagerId
      },
      projection
    })
    return gardenManager
  }

  public async findByEmail(email: string, projection?: string | Record<string, any>) {
    const gardenManager = await this.gardenManagerRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return gardenManager
  }

  public update(
    conditions: FilterQuery<GardenManager>,
    payload: UpdateQuery<GardenManager>,
    options?: QueryOptions | undefined
  ) {
    return this.gardenManagerRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(
    pagination: PaginationParams,
    queryGardenManagerDto: QueryGardenManagerDto,
    projection = GARDEN_MANAGER_LIST_PROJECTION
  ) {
    const { name, email, status } = queryGardenManagerDto
    const filter: Record<string, any> = {}

    const validStatus = status?.filter((status) =>
      [GardenManagerStatus.ACTIVE, GardenManagerStatus.INACTIVE].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    return this.gardenManagerRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }
}
