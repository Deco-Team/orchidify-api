import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { GardenManager, GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema'
import { AbstractRepository } from '@common/repositories'

export const IGardenManagerRepository = Symbol('IGardenManagerRepository')

export interface IGardenManagerRepository extends AbstractRepository<GardenManagerDocument> {}

@Injectable()
export class GardenManagerRepository extends AbstractRepository<GardenManagerDocument> implements IGardenManagerRepository {
  constructor(@InjectModel(GardenManager.name) model: PaginateModel<GardenManagerDocument>) {
    super(model)
  }
}
