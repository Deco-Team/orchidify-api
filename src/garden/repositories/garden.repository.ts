import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Garden, GardenDocument } from '@garden/schemas/garden.schema'
import { AbstractRepository } from '@common/repositories'

export const IGardenRepository = Symbol('IGardenRepository')

export interface IGardenRepository extends AbstractRepository<GardenDocument> {}

@Injectable()
export class GardenRepository extends AbstractRepository<GardenDocument> implements IGardenRepository {
  constructor(@InjectModel(Garden.name) model: PaginateModel<GardenDocument>) {
    super(model)
  }
}
