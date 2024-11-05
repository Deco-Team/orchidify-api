import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PaymentController } from '@src/transaction/controllers/payment.controller'
import { Transaction, TransactionSchema } from '@src/transaction/schemas/transaction.schema'
import { IPaymentService, PaymentService } from '@src/transaction/services/payment.service'
import { ITransactionRepository, TransactionRepository } from '@src/transaction/repositories/transaction.repository'
import { HttpModule } from '@nestjs/axios'
import { ZaloPayPaymentStrategy } from '@src/transaction/strategies/zalopay.strategy'
import { MomoPaymentStrategy } from '@src/transaction/strategies/momo.strategy'
import { PayOSPaymentStrategy } from '@src/transaction/strategies/payos.strategy'
import { ITransactionService, TransactionService } from './services/transaction.service'
import { LearnerModule } from '@learner/learner.module'
import { StripePaymentStrategy } from './strategies/stripe.strategy'
import { TransactionController } from './controllers/transaction.controller'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    HttpModule,
    LearnerModule
  ],
  controllers: [PaymentController, TransactionController],
  providers: [
    {
      provide: IPaymentService,
      useClass: PaymentService
    },
    {
      provide: ITransactionService,
      useClass: TransactionService
    },
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository
    },
    ZaloPayPaymentStrategy,
    MomoPaymentStrategy,
    PayOSPaymentStrategy,
    StripePaymentStrategy
  ],
  exports: [
    {
      provide: IPaymentService,
      useClass: PaymentService
    },
    {
      provide: ITransactionService,
      useClass: TransactionService
    },
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository
    }
  ]
})
export class TransactionModule {}
