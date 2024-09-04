import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { InstructorStatus } from '@common/contracts/constant'

class PaymentInfo {
  @Prop({ type: String })
  type: string

  @Prop({ type: String })
  accountNumber: string

  @Prop({ type: String })
  accountName: string

  @Prop({ type: Object })
  metadata: unknown
}

export type InstructorDocument = HydratedDocument<Instructor>

@Schema({
  collection: 'instructors',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Instructor {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true, select: false })
  password: string

  @Prop({ type: String, required: true })
  phone: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: Date, required: true })
  dateOfBirth: Date

  @Prop({ type: Array })
  certificates: unknown[]

  @Prop({ type: String })
  bio: string

  @Prop({ type: String, required: true })
  idCardPhoto: string

  @Prop({ type: String })
  avatar: string

  @Prop({
    enum: InstructorStatus,
    default: InstructorStatus.ACTIVE
  })
  status: InstructorStatus

  @Prop({ type: Number, default: 0 })
  balance: number

  @Prop({ type: PaymentInfo })
  paymentInfo: PaymentInfo
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor)

InstructorSchema.plugin(paginate)
InstructorSchema.index({ email: 1 })