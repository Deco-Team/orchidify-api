import { Injectable, Inject } from '@nestjs/common'
import { IGardenManagerRepository } from '@garden-manager/repositories/garden-manager.repository'
import { GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema'
import { SaveOptions } from 'mongoose'
import { IAuthUserService } from '@auth/services/auth.service'

export const IGardenManagerService = Symbol('IGardenManagerService')

export interface IGardenManagerService extends IAuthUserService {
  create(gardenManager: any, options?: SaveOptions | undefined): Promise<GardenManagerDocument>
  findById(gardenManagerId: string, projection?: string | Record<string, any>): Promise<GardenManagerDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<GardenManagerDocument>
}

@Injectable()
export class GardenManagerService implements IGardenManagerService {
  constructor(
    @Inject(IGardenManagerRepository)
    private readonly gardenManagerRepository: IGardenManagerRepository
  ) {}

  public create(gardenManager: any, options?: SaveOptions | undefined) {
    return this.gardenManagerRepository.create(gardenManager, options)
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
}
