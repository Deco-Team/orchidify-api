import { Injectable, Inject } from '@nestjs/common'
import { IGardenRepository } from '@garden/repositories/garden.repository'
import { GardenDocument } from '@garden/schemas/garden.schema'
import { SaveOptions } from 'mongoose'

export const IGardenService = Symbol('IGardenService')

export interface IGardenService {
  create(garden: any, options?: SaveOptions | undefined): Promise<GardenDocument>
  findById(gardenId: string): Promise<GardenDocument>
}

@Injectable()
export class GardenService implements IGardenService {
  constructor(
    @Inject(IGardenRepository)
    private readonly GardenRepository: IGardenRepository
  ) {}

  public create(garden: any, options?: SaveOptions | undefined) {
    return this.GardenRepository.create(garden, options)
  }

  public async findById(gardenId: string) {
    const garden = await this.GardenRepository.findOne({
      conditions: {
        _id: gardenId
      },
    })
    return garden
  }
}
