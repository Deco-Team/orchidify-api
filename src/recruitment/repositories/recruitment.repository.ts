import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Recruitment, RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'
import { AbstractRepository } from '@common/repositories'

export const IRecruitmentRepository = Symbol('IRecruitmentRepository')

export interface IRecruitmentRepository  extends AbstractRepository<RecruitmentDocument> {
}

@Injectable()
export class RecruitmentRepository extends AbstractRepository<RecruitmentDocument> implements IRecruitmentRepository {
  constructor(@InjectModel(Recruitment.name) model: PaginateModel<RecruitmentDocument>) {
    super(model)
  }
}
