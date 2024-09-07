import { IAuthUserService } from '@auth/services/auth.service'
import { Injectable, Inject } from '@nestjs/common'
import { IStaffRepository } from '@staff/repositories/staff.repository'
import { StaffDocument } from '@staff/schemas/staff.schema'
import { SaveOptions } from 'mongoose'

export const IStaffService = Symbol('IStaffService')

export interface IStaffService extends IAuthUserService {
  create(staff: any, options?: SaveOptions | undefined): Promise<StaffDocument>
  findById(staffId: string, projection?: string | Record<string, any>): Promise<StaffDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<StaffDocument>
}

@Injectable()
export class StaffService implements IStaffService {
  constructor(
    @Inject(IStaffRepository)
    private readonly staffRepository: IStaffRepository
  ) {}

  public create(staff: any, options?: SaveOptions | undefined) {
    return this.staffRepository.create(staff, options)
  }

  public async findById(staffId: string, projection?: string | Record<string, any>) {
    const staff = await this.staffRepository.findOne({
      conditions: {
        _id: staffId
      },
      projection
    })
    return staff
  }

  public async findByEmail(email: string, projection?: string | Record<string, any>) {
    const staff = await this.staffRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return staff
  }
}
