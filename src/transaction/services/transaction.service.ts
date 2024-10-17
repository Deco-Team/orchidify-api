import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository'
import { Transaction, TransactionDocument } from '@src/transaction/schemas/transaction.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { TransactionStatus } from '@common/contracts/constant'
import { MongoServerError } from 'mongodb'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { AppLogger } from '@common/services/app-logger.service'
import { CreateTransactionDto } from '@transaction/dto/create-transaction.dto'

export const ITransactionService = Symbol('ITransactionService')

export interface ITransactionService {
  create(createTransactionDto: CreateTransactionDto, options?: SaveOptions | undefined): Promise<TransactionDocument>
  // findById(
  //   transactionId: string,
  //   projection?: string | Record<string, any>,
  //   populates?: Array<PopulateOptions>
  // ): Promise<TransactionDocument>
  // update(
  //   conditions: FilterQuery<Transaction>,
  //   payload: UpdateQuery<Transaction>,
  //   options?: QueryOptions | undefined
  // ): Promise<TransactionDocument>
  // list(
  //   pagination: PaginationParams,
  //   queryTransactionDto: QueryTransactionDto,
  //   projection?: string | Record<string, any>,
  //   populate?: Array<PopulateOptions>
  // )
}

@Injectable()
export class TransactionService implements ITransactionService {
  private readonly appLogger = new AppLogger(TransactionService.name)
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  public async create(createTransactionDto: CreateTransactionDto, options?: SaveOptions | undefined) {
    return await this.transactionRepository.create(createTransactionDto, options)
  }

  public async findById(
    transactionId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const transaction = await this.transactionRepository.findOne({
      conditions: {
        _id: transactionId
      },
      projection,
      populates
    })
    return transaction
  }

  public async update(
    conditions: FilterQuery<Transaction>,
    payload: UpdateQuery<Transaction>,
    options?: QueryOptions | undefined
  ) {
    return await this.transactionRepository.findOneAndUpdate(conditions, payload, options)
  }

  // async list(
  //   pagination: PaginationParams,
  //   queryCourseDto: QueryTransactionDto,
  //   projection = GARDEN_LIST_PROJECTION,
  //   populate?: Array<PopulateOptions>
  // ) {
  //   const { name, address, status, transactionManagerId } = queryCourseDto
  //   const filter: Record<string, any> = {}
  //   if (transactionManagerId) {
  //     filter['transactionManagerId'] = transactionManagerId
  //   }

  //   const validStatus = status?.filter((status) =>
  //     [TransactionStatus.ACTIVE, TransactionStatus.INACTIVE].includes(status)
  //   )
  //   if (validStatus?.length > 0) {
  //     filter['status'] = {
  //       $in: validStatus
  //     }
  //   }

  //   let textSearch = ''
  //   if (name) textSearch += name.trim()
  //   if (address) textSearch += ' ' + address.trim()
  //   if (textSearch) {
  //     filter['$text'] = {
  //       $search: textSearch.trim()
  //     }
  //   }

  //   return this.transactionRepository.model.paginate(filter, {
  //     ...pagination,
  //     projection,
  //     populate
  //   })
  // }
}
