import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { TransactionStatus, UserRole } from '@common/contracts/constant'
import { PaymentMethod, TransactionType } from '@src/transaction/contracts/constant'

export class TransactionAccount {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole, required: true })
  userRole: UserRole
}

export class Payment {
  @Prop({ type: String, required: true })
  id: string

  @Prop({ type: String, required: true })
  code: string

  @Prop({ type: Date, required: true })
  createdAt: Date

  @Prop({ type: String, required: true })
  status: string

  @Prop({
    type: [Payment]
  })
  histories: Payment[]
}

export class Payout {
  @Prop({ type: String, required: true })
  id: string

  @Prop({ type: String, required: true })
  code: string

  @Prop({ type: Date, required: true })
  createdAt: Date

  @Prop({ type: String, required: true })
  status: string

  @Prop({
    type: [Payout]
  })
  histories: Payout[]
}

export type TransactionDocument = HydratedDocument<Transaction>

@Schema({
  collection: 'transactions',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Transaction {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ enum: TransactionType, required: true })
  type: TransactionType

  @Prop({ enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Prop({ type: Number, required: true })
  amount: number

  @Prop({ type: TransactionAccount })
  debitAccount: TransactionAccount

  @Prop({ type: TransactionAccount })
  creditAccount: TransactionAccount

  @Prop({ type: String })
  description: string

  @Prop({ enum: TransactionStatus, required: true })
  status: TransactionStatus

  @Prop({ type: Payment })
  payment: Payment

  @Prop({ type: Payout })
  payout: Payout
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)

TransactionSchema.plugin(paginate)
