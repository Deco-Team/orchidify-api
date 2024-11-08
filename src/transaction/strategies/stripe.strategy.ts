import Stripe from 'stripe'
import { IClassService } from '@class/services/class.service'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { TransactionStatus } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { AppException } from '@common/exceptions/app.exception'
import { BadRequestException, forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection } from '@nestjs/mongoose'
import { StripeStatus, TransactionType } from '@src/transaction/contracts/constant'
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository'
import { IPaymentStrategy } from '@src/transaction/strategies/payment-strategy.interface'
import { BasePaymentDto } from '@transaction/dto/base.transaction.dto'
import { get } from 'lodash'
import { Connection, Types } from 'mongoose'
import { NotificationAdapter } from '@common/adapters/notification.adapter'
import { ILearnerService } from '@learner/services/learner.service'
import {
  CreateStripePaymentDto,
  QueryStripePaymentDto,
  RefundStripePaymentDto
} from '@transaction/dto/stripe-payment.dto'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'

@Injectable()
export class StripePaymentStrategy implements IPaymentStrategy, OnModuleInit {
  private readonly logger = new Logger(StripePaymentStrategy.name)
  private stripe: Stripe
  private publishableKey: string
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly notificationAdapter: NotificationAdapter,
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(forwardRef(() => IClassService))
    private readonly classService: IClassService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService,
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {}
  async onModuleInit() {
    this.stripe = new Stripe(this.configService.get('payment.stripe.apiKey'))
    this.publishableKey = (await this.settingService.findByKey(SettingKey.StripePublishableKey)).value as string
  }

  async createTransaction(createStripePaymentDto: CreateStripePaymentDto) {
    const { customerEmail, amount, description, metadata } = createStripePaymentDto
    const customer = await this.stripe.customers.create({
      email: customerEmail
    })
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-10-28.acacia' }
    )
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'vnd',
      customer: customer.id,
      description: description,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true
      }
    })
    const createStripePaymentResponse = {
      id: paymentIntent.id,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: this.publishableKey
    }
    this.logger.log(JSON.stringify(createStripePaymentResponse))

    return createStripePaymentResponse

    // const session = await this.stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'vnd',
    //         product_data: {
    //           name: 'T-shirt',
    //           description: 'Orchid Flower Sticks',
    //           images: [
    //             'https://www.coopersofstortford.co.uk/images/products/medium/M236i.jpg',
    //             'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbhK63v9WwEwLipJ72cuTyqTS-ssxrTzMNj7T1Z30XUPAQj7XCFRqXAsdAy4qsbK7I14g&usqp=CAU'
    //           ]
    //         },
    //         unit_amount: 20000
    //       },
    //       quantity: 2
    //     }
    //   ],
    //   mode: 'payment',
    //   success_url: 'http://localhost:4242/success',
    //   cancel_url: 'http://localhost:4242/cancel',
    //   expires_at: moment().tz(VN_TIMEZONE).add(30, 'minute').unix()
    // })

    // return session
  }

  async getTransaction(queryDto: QueryStripePaymentDto) {
    const { id } = queryDto
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id)
    return paymentIntent
  }

  async refundTransaction(refundDto: RefundStripePaymentDto) {
    const { id, amount, metadata } = refundDto
    const refund = await this.stripe.refunds.create({
      payment_intent: id,
      amount,
      metadata,
      currency: 'vnd'
    })
    return refund
  }

  async getRefundTransaction(queryDto: any) {}

  async processWebhook(event: Stripe.Event) {
    // Handle the event
    let paymentIntent: Stripe.PaymentIntent
    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object
        this.logger.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
        // Then define and call a method to handle the successful payment intent.
        await this.handlePaymentIntentSucceeded(paymentIntent)
        break
      case 'payment_intent.processing':
        paymentIntent = event.data.object
        this.logger.log(`PaymentIntent for ${paymentIntent.amount} was processing!`)
        break
      case 'payment_intent.payment_failed':
        paymentIntent = event.data.object
        this.logger.log(`PaymentIntent for ${paymentIntent.amount} was failed!`)
        await this.handlePaymentIntentFailed(paymentIntent)
        break
      default:
        this.logger.error(`Unhandled event type ${event.type}.`)
    }
  }

  verifyPaymentWebhookData(params: { rawBody: any; signature: string }): Stripe.Event {
    const { rawBody, signature } = params
    try {
      this.logger.log(`Webhook signature verification...`)
      const webhookSecret = this.configService.get('payment.stripe.webhookSecret')
      const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      return event
    } catch (err) {
      this.logger.error(`⚠️  Webhook signature verification failed.`, err.message)
      throw new BadRequestException(`⚠️  Webhook signature verification failed.`)
    }
  }

  private async sendNotificationWhenPaymentSuccess({ learnerId, classId }) {
    try {
      const [learner, courseClass] = await Promise.all([
        this.learnerService.findById(learnerId),
        this.classService.findById(classId)
      ])
      this.notificationAdapter.sendMail({
        to: learner?.email,
        subject: `[Orchidify] Xác nhận đăng ký lớp học ${courseClass?.title} thành công`,
        template: 'learner/enroll-class',
        context: {
          classTitle: courseClass?.title,
          name: learner?.name
        }
      })
    } catch (error) {}
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        const paymentIntentId = get(paymentIntent, 'id')
        this.logger.log(`handlePaymentIntentSucceeded: [start] paymentIntentId=${paymentIntentId}`)
        const isPaymentSuccess = get(paymentIntent, 'status') === StripeStatus.SUCCEEDED
        if (isPaymentSuccess) {
          this.logger.log('handlePaymentIntentSucceeded: payment SUCCESS')
          const transaction = await this.transactionRepository.findOne({
            conditions: {
              type: TransactionType.PAYMENT,
              'payment.id': paymentIntentId,
              status: TransactionStatus.DRAFT
            }
          })
          if (!transaction) throw new AppException(Errors.TRANSACTION_NOT_FOUND)
          // 1. Fetch learnerId, classId from extraData => create learnerClass
          const { learnerId, classId, orderCode } = get(paymentIntent, 'metadata')
          await this.learnerClassService.create(
            {
              enrollDate: new Date(),
              // status: LearnerClassStatus.ENROLLED,
              transactionId: transaction._id,
              learnerId: new Types.ObjectId(learnerId),
              classId: new Types.ObjectId(classId)
            },
            { session }
          )
          // 2. Update learnerQuantity in class
          await this.classService.update(
            { _id: new Types.ObjectId(classId) },
            {
              $inc: {
                learnerQuantity: 1
              }
            },
            { session }
          )
          // 3.  Update payment to transaction
          const paymentPayLoad = {
            id: paymentIntent?.id,
            code: orderCode,
            createdAt: new Date(),
            status: transaction?.status,
            ...paymentIntent
          }
          const newPayment: BasePaymentDto = {
            ...paymentPayLoad,
            histories: [...transaction.payment.histories, paymentPayLoad]
          }
          await this.transactionRepository.findOneAndUpdate(
            { _id: transaction._id },
            {
              status: TransactionStatus.CAPTURED,
              payment: newPayment
            },
            { session }
          )
          // 4. Send email/notification to learner
          this.sendNotificationWhenPaymentSuccess({ learnerId, classId })
          // 5. Send notification to staff
        }
      })
      this.logger.log('handlePaymentIntentSucceeded: [completed]')
      return true
    } finally {
      await session.endSession()
    }
  }
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    // Execute in transaction
    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        const paymentIntentId = get(paymentIntent, 'id')
        this.logger.log(`handlePaymentIntentFailed: [start] paymentIntentId=${paymentIntentId}`)
        this.logger.log('handlePaymentIntentFailed: payment FAILED')
        // 1.  Update payment to transaction
        const transaction = await this.transactionRepository.findOne({
          conditions: {
            type: TransactionType.PAYMENT,
            'payment.id': paymentIntentId,
            status: TransactionStatus.DRAFT
          }
        })
        if (!transaction) throw new AppException(Errors.TRANSACTION_NOT_FOUND)
        const { orderCode } = get(paymentIntent, 'metadata')
        const paymentPayLoad = {
          id: paymentIntent?.id,
          code: orderCode,
          createdAt: new Date(),
          status: transaction?.status,
          ...paymentIntent
        }
        const newPayment: BasePaymentDto = {
          ...paymentPayLoad,
          histories: [...transaction.payment.histories, paymentPayLoad]
        }
        await this.transactionRepository.findOneAndUpdate(
          { _id: transaction._id },
          {
            status: TransactionStatus.ERROR,
            payment: newPayment
          },
          { session }
        )
      })
      this.logger.log('handlePaymentIntentFailed: [completed]')
      return true
    } finally {
      await session.endSession()
    }
  }
}
