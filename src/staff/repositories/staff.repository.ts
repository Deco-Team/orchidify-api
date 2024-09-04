import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Staff, StaffDocument } from '@staff/schemas/staff.schema'
import { AbstractRepository } from '@common/repositories'

export const IStaffRepository = Symbol('IStaffRepository')

export interface IStaffRepository extends AbstractRepository<StaffDocument> {}

@Injectable()
export class StaffRepository extends AbstractRepository<StaffDocument> implements IStaffRepository {
  constructor(@InjectModel(Staff.name) model: PaginateModel<StaffDocument>) {
    super(model)
  }
}
