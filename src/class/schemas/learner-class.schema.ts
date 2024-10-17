import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { LearnerClassStatus } from '@src/common/contracts/constant'
import { Transaction } from '@transaction/schemas/transaction.schema'
import { Learner } from '@learner/schemas/learner.schema'
import { Class } from './class.schema'

export type LearnerClassDocument = HydratedDocument<LearnerClass>

@Schema({
  collection: 'learner-classes',
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
export class LearnerClass {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Date, required: true })
  enrollDate: Date

  @Prop({ type: Number, required: true, default: 0 })
  progress: number

  @Prop({ enum: LearnerClassStatus, required: true })
  status: LearnerClassStatus

  @Prop({ type: Date })
  finishDate: Date

  @Prop({ type: Types.ObjectId, ref: Transaction.name, required: true })
  transactionId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Learner.name, required: true })
  learnerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Class.name, required: true })
  classId: Types.ObjectId
}

export const LearnerClassSchema = SchemaFactory.createForClass(LearnerClass)
LearnerClassSchema.plugin(paginate)
// LearnerClassSchema.index({ title: 'text', type: 'text' })

LearnerClassSchema.virtual('learner', {
  ref: 'Learner',
  localField: 'learnerId',
  foreignField: '_id',
  justOne: true
})

LearnerClassSchema.virtual('class', {
  ref: 'Class',
  localField: 'classId',
  foreignField: '_id',
  justOne: true
})