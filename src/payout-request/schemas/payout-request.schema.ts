import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { PayoutRequestStatus, UserRole } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Course } from '@course/schemas/course.schema'
import { Staff } from '@staff/schemas/staff.schema'
import { Transaction } from '@transaction/schemas/transaction.schema'
import { BaseMediaDto } from '@media/dto/base-media.dto'

export type PayoutRequestDocument = HydratedDocument<PayoutRequest>

export class PayoutRequestStatusHistory {
  @Prop({ enum: PayoutRequestStatus, required: true })
  status: PayoutRequestStatus

  @Prop({ type: Date, required: true })
  timestamp: Date

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole })
  userRole: UserRole
}

@Schema({
  collection: 'payout-requests',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    },
    virtuals: true
  }
})
export class PayoutRequest {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Number, required: true })
  amount: number

  @Prop({
    enum: PayoutRequestStatus,
    default: PayoutRequestStatus.PENDING
  })
  status: PayoutRequestStatus

  @Prop({ type: String })
  rejectReason: string

  @Prop({
    type: [PayoutRequestStatusHistory]
  })
  histories: PayoutRequestStatusHistory[]

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Staff.name })
  handledBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Transaction.name })
  transactionId: Types.ObjectId

  @Prop({ type: Boolean })
  hasMadePayout: boolean

  @Prop({ type: String })
  transactionCode: string

  @Prop({ type: BaseMediaDto })
  attachment: BaseMediaDto
}

export const PayoutRequestSchema = SchemaFactory.createForClass(PayoutRequest)
PayoutRequestSchema.plugin(paginate)
PayoutRequestSchema.index({ createdBy: 1 })
