import { Inject, Injectable, Logger } from '@nestjs/common'
import { IPaymentStrategy } from '@src/transaction/strategies/payment-strategy.interface'
import {
  MomoPaymentResponseDto,
  QueryMomoPaymentDto,
  RefundMomoPaymentDto
} from '@src/transaction/dto/momo-payment.dto'
import { MomoPaymentStrategy } from '@src/transaction/strategies/momo.strategy'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection, FilterQuery } from 'mongoose'
import { ITransactionRepository, TransactionRepository } from '@src/transaction/repositories/transaction.repository'
import { TransactionStatus } from '@common/contracts/constant'
import { PaymentMethod } from '@src/transaction/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { Transaction } from '@src/transaction/schemas/transaction.schema'
import { PayOSPaymentStrategy } from '@src/transaction/strategies/payos.strategy'
import { WebhookType as PayOSWebhookData } from '@payos/node/lib/type'
import { ZaloPayPaymentStrategy } from '@src/transaction/strategies/zalopay.strategy'
import { StripePaymentStrategy } from '@transaction/strategies/stripe.strategy'
import { QueryStripePaymentDto } from '@transaction/dto/stripe-payment.dto'

export const IPaymentService = Symbol('IPaymentService')

export interface IPaymentService {
  setStrategy(paymentMethod: PaymentMethod): void
  verifyPaymentWebhookData(webhookData: any): any
  createTransaction(createPaymentDto: any): any
  getTransaction(queryPaymentDto: QueryMomoPaymentDto | QueryStripePaymentDto): any
  refundTransaction(refundPaymentDto: RefundMomoPaymentDto): any
  getRefundTransaction(queryPaymentDto: QueryMomoPaymentDto): any
  getPaymentList(filter: any, paginationParams: PaginationParams): Promise<any>
  processWebhook(webhookData: MomoPaymentResponseDto | PayOSWebhookData): Promise<any>
}

@Injectable()
export class PaymentService implements IPaymentService {
  private strategy: IPaymentStrategy
  private readonly logger = new Logger(PaymentService.name)
  constructor(
    @InjectConnection() readonly connection: Connection,
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    private readonly momoPaymentStrategy: MomoPaymentStrategy,
    private readonly zaloPayPaymentStrategy: ZaloPayPaymentStrategy,
    private readonly payOSPaymentStrategy: PayOSPaymentStrategy,
    private readonly stripePaymentStrategy: StripePaymentStrategy
  ) {}

  public setStrategy(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.MOMO:
        this.strategy = this.momoPaymentStrategy
        break
      case PaymentMethod.ZALO_PAY:
        this.strategy = this.zaloPayPaymentStrategy
        break
      case PaymentMethod.PAY_OS:
        this.strategy = this.payOSPaymentStrategy
        break
      case PaymentMethod.STRIPE:
      default:
        this.strategy = this.stripePaymentStrategy
        break
    }
  }

  public verifyPaymentWebhookData(webhookData: any) {
    return this.strategy.verifyPaymentWebhookData(webhookData)
  }

  public createTransaction(createPaymentDto: any) {
    return this.strategy.createTransaction(createPaymentDto)
  }

  public getTransaction(queryPaymentDto: QueryMomoPaymentDto) {
    return this.strategy.getTransaction(queryPaymentDto)
  }

  public refundTransaction(refundPaymentDto: RefundMomoPaymentDto) {
    return this.strategy.refundTransaction(refundPaymentDto)
  }

  public getRefundTransaction(queryPaymentDto: QueryMomoPaymentDto) {
    return this.strategy.getRefundTransaction(queryPaymentDto)
  }

  public async getPaymentList(filter: FilterQuery<Transaction>, paginationParams: PaginationParams) {
    const result = await this.transactionRepository.paginate(
      {
        ...filter,
        transactionStatus: {
          $in: [TransactionStatus.CAPTURED, TransactionStatus.REFUNDED]
        }
      },
      {
        projection: '-transactionHistory',
        ...paginationParams
      }
    )
    return result
  }

  public async processWebhook(webhookData: MomoPaymentResponseDto | PayOSWebhookData) {
    this.logger.log('processWebhook::', JSON.stringify(webhookData))
    return this.strategy.processWebhook(webhookData)
  }
}
