import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Class, ClassDocument } from '@src/class/schemas/class.schema'
import { AbstractRepository } from '@common/repositories'

export const IClassRepository = Symbol('IClassRepository')

export interface IClassRepository extends AbstractRepository<ClassDocument> {}

@Injectable()
export class ClassRepository extends AbstractRepository<ClassDocument> implements IClassRepository {
  constructor(@InjectModel(Class.name) model: PaginateModel<ClassDocument>) {
    super(model)
  }
}
