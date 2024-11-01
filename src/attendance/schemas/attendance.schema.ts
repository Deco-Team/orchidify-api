import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { AttendanceStatus } from '@common/contracts/constant'
import { Learner } from '@learner/schemas/learner.schema'
import { Slot } from '@garden-timesheet/schemas/slot.schema'

export type AttendanceDocument = HydratedDocument<Attendance>

@Schema({
  collection: 'attendances',
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
export class Attendance {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({
    enum: AttendanceStatus,
    default: AttendanceStatus.NOT_YET
  })
  status: AttendanceStatus

  @Prop({ type: String })
  note: string

  @Prop({ type: Types.ObjectId, ref: Learner.name, required: true })
  learnerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Slot.name, required: true })
  slotId: Types.ObjectId
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance)

AttendanceSchema.plugin(paginate)

AttendanceSchema.index({ slotId: 1, learnerId: 1 })

AttendanceSchema.virtual('learner', {
  ref: 'Learner',
  localField: 'learnerId',
  foreignField: '_id',
  justOne: true
})
