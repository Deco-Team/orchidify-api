import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClassRequest, ClassRequestDocument } from '@src/class-request/schemas/class-request.schema'
import { AbstractRepository } from '@common/repositories'

export const IClassRequestRepository = Symbol('IClassRequestRepository')

export interface IClassRequestRepository extends AbstractRepository<ClassRequestDocument> {}

@Injectable()
export class ClassRequestRepository extends AbstractRepository<ClassRequestDocument> implements IClassRequestRepository {
  constructor(@InjectModel(ClassRequest.name) model: PaginateModel<ClassRequestDocument>) {
    super(model)
  }
}
