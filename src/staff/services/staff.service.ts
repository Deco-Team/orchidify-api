import { IAuthUserService } from '@auth/services/auth.service'
import { Injectable, Inject } from '@nestjs/common'
import { IStaffRepository } from '@staff/repositories/staff.repository'
import { Staff } from '@staff/schemas/staff.schema'
import { SaveOptions } from 'mongoose'

export const IStaffService = Symbol('IStaffService')

export interface IStaffService extends IAuthUserService {
  create(staff: any, options?: SaveOptions | undefined): Promise<Staff>
  findById(staffId: string): Promise<Staff>
}

@Injectable()
export class StaffService implements IStaffService {
  constructor(
    @Inject(IStaffRepository)
    private readonly staffRepository: IStaffRepository
  ) {}

  public create(staff: any, options?: SaveOptions | undefined): Promise<Staff> {
    return this.staffRepository.create(staff, options)
  }

  public async findById(staffId: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      conditions: {
        _id: staffId
      },
      projection: '-password'
    })
    return staff
  }

  public async findByEmail(email: string, projection: string | Record<string, any>): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return staff
  }
}
