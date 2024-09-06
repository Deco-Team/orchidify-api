import { Injectable, Inject } from '@nestjs/common'
import { IInstructorRepository } from '@instructor/repositories/instructor.repository'
import { InstructorDocument } from '@instructor/schemas/instructor.schema'
import { SaveOptions } from 'mongoose'
import { IAuthUserService } from '@auth/services/auth.service'

export const IInstructorService = Symbol('IInstructorService')

export interface IInstructorService extends IAuthUserService {
  create(instructor: any, options?: SaveOptions | undefined): Promise<InstructorDocument>
  findById(instructorId: string): Promise<InstructorDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<InstructorDocument>
}

@Injectable()
export class InstructorService implements IInstructorService {
  constructor(
    @Inject(IInstructorRepository)
    private readonly instructorRepository: IInstructorRepository
  ) {}

  public create(instructor: any, options?: SaveOptions | undefined) {
    return this.instructorRepository.create(instructor, options)
  }

  public async findById(instructorId: string) {
    const instructor = await this.instructorRepository.findOne({
      conditions: {
        _id: instructorId
      },
      projection: '-password'
    })
    return instructor
  }

  public async findByEmail(email: string, projection: string | Record<string, any>) {
    const instructor = await this.instructorRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return instructor
  }
}
