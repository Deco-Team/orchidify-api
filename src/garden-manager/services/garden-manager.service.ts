import { Injectable, Inject } from '@nestjs/common'
import { IGardenManagerRepository } from '@garden-manager/repositories/garden-manager.repository'
import { GardenManager } from '@garden-manager/schemas/garden-manager.schema'
import { SaveOptions } from 'mongoose'
import { IAuthUserService } from '@auth/services/auth.service'

export const IGardenManagerService = Symbol('IGardenManagerService')

export interface IGardenManagerService extends IAuthUserService {
  create(gardenManager: any, options?: SaveOptions | undefined): Promise<GardenManager>
  findById(gardenManagerId: string): Promise<GardenManager>
}

@Injectable()
export class GardenManagerService implements IGardenManagerService {
  constructor(
    @Inject(IGardenManagerRepository)
    private readonly gardenManagerRepository: IGardenManagerRepository
  ) {}

  public create(gardenManager: any, options?: SaveOptions | undefined): Promise<GardenManager> {
    return this.gardenManagerRepository.create(gardenManager, options)
  }

  public async findById(gardenManagerId: string): Promise<GardenManager> {
    const gardenManager = await this.gardenManagerRepository.findOne({
      conditions: {
        _id: gardenManagerId
      },
      projection: '-password'
    })
    return gardenManager
  }

  public async findByEmail(email: string, projection: string | Record<string, any>): Promise<GardenManager> {
    const gardenManager = await this.gardenManagerRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return gardenManager
  }
}
