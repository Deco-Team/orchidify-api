import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AbstractRepository } from '@common/repositories'
import { Transaction, TransactionDocument } from '@src/transaction/schemas/transaction.schema'

export const ITransactionRepository = Symbol('ITransactionRepository')

export interface ITransactionRepository extends AbstractRepository<TransactionDocument> {}

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionDocument> {
  constructor(@InjectModel(Transaction.name) model: PaginateModel<TransactionDocument>) {
    super(model)
  }
}
