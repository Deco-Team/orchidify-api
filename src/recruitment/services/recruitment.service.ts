import { RecruitmentStatus } from '@common/contracts/constant'
import { Injectable, Inject } from '@nestjs/common'
import { IRecruitmentRepository } from '@recruitment/repositories/recruitment.repository'
import { RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'
import { SaveOptions } from 'mongoose'

export const IRecruitmentService = Symbol('IRecruitmentService')

export interface IRecruitmentService {
  create(recruitment: any, options?: SaveOptions | undefined): Promise<RecruitmentDocument>
  findById(recruitmentId: string): Promise<RecruitmentDocument>
  findByApplicationEmailAndStatus(applicationEmail: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]>
}

@Injectable()
export class RecruitmentService implements IRecruitmentService {
  constructor(
    @Inject(IRecruitmentRepository)
    private readonly recruitmentRepository: IRecruitmentRepository
  ) {}

  public create(recruitment: any, options?: SaveOptions | undefined) {
    return this.recruitmentRepository.create(recruitment, options)
  }

  public async findById(recruitmentId: string) {
    const recruitment = await this.recruitmentRepository.findOne({
      conditions: {
        _id: recruitmentId
      },
    })
    return recruitment
  }

  findByApplicationEmailAndStatus(
    applicationEmail: string,
    status: RecruitmentStatus[]
  ): Promise<RecruitmentDocument[]> {
    return this.recruitmentRepository.findMany({
      conditions: {
        'applicationInfo.email': applicationEmail,
        status: {
          $in: status
        }
      },
    })
  }
}
