import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository'
import { Transaction, TransactionDocument } from '@src/transaction/schemas/transaction.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { TransactionStatus } from '@common/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { CreateTransactionDto } from '@transaction/dto/create-transaction.dto'
import { QueryTransactionDto } from '@transaction/dto/view-transaction.dto'
import { PaymentMethod, TRANSACTION_LIST_PROJECTION, TransactionType } from '@transaction/contracts/constant'

export const ITransactionService = Symbol('ITransactionService')

export interface ITransactionService {
  create(createTransactionDto: CreateTransactionDto, options?: SaveOptions | undefined): Promise<TransactionDocument>
  findById(
    transactionId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<TransactionDocument>
  update(
    conditions: FilterQuery<Transaction>,
    payload: UpdateQuery<Transaction>,
    options?: QueryOptions | undefined
  ): Promise<TransactionDocument>
  list(
    pagination: PaginationParams,
    queryTransactionDto: QueryTransactionDto,
    projection?: string | Record<string, any>,
    populate?: Array<PopulateOptions>
  )
  viewReportTransactionByDate({ fromDate, toDate }: { fromDate: Date; toDate: Date }): Promise<any[]>
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

  async list(
    pagination: PaginationParams,
    queryTransactionDto: QueryTransactionDto,
    projection = TRANSACTION_LIST_PROJECTION,
    populate?: Array<PopulateOptions>
  ) {
    const { type, paymentMethod, status, fromAmount, toAmount } = queryTransactionDto
    const filter: Record<string, any> = {
      status: {
        $in: [TransactionStatus.CAPTURED, TransactionStatus.ERROR, TransactionStatus.CANCELED]
      }
    }

    const validType = type?.filter((type) => [TransactionType.PAYMENT, TransactionType.PAYOUT].includes(type))
    if (validType?.length > 0) {
      filter['type'] = {
        $in: validType
      }
    }

    const validPaymentMethod = paymentMethod?.filter((paymentMethod) =>
      [PaymentMethod.STRIPE, PaymentMethod.MOMO].includes(paymentMethod)
    )
    if (validPaymentMethod?.length > 0) {
      filter['paymentMethod'] = {
        $in: validPaymentMethod
      }
    }

    const validStatus = status?.filter((status) =>
      [TransactionStatus.CAPTURED, TransactionStatus.ERROR, TransactionStatus.CANCELED].includes(status)
    )
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    if (fromAmount !== undefined && toAmount !== undefined) {
      filter['amount'] = {
        $gte: fromAmount,
        $lte: toAmount
      }
    }

    return this.transactionRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate
    })
  }

  async viewReportTransactionByDate({ fromDate, toDate }) {
    return this.transactionRepository.model.aggregate([
      {
        $match: {
          status: TransactionStatus.CAPTURED,
          updatedAt: {
            $gte: fromDate,
            $lte: toDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$updatedAt'
            }
          },
          paymentAmount: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: ['$type', TransactionType.PAYMENT]
                    },
                    then: '$amount'
                  }
                ],
                default: 0
              }
            }
          },
          payoutAmount: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: ['$type', TransactionType.PAYOUT]
                    },
                    then: '$amount'
                  }
                ],
                default: 0
              }
            }
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ])
  }
}
