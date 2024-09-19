import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { AbstractRepository } from '@common/repositories'

export const IGardenTimesheetRepository = Symbol('IGardenTimesheetRepository')

export interface IGardenTimesheetRepository extends AbstractRepository<GardenTimesheetDocument> {}

@Injectable()
export class GardenTimesheetRepository extends AbstractRepository<GardenTimesheetDocument> implements IGardenTimesheetRepository {
  constructor(@InjectModel(GardenTimesheet.name) model: PaginateModel<GardenTimesheetDocument>) {
    super(model)
  }
}
