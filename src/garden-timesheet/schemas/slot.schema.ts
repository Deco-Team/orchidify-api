import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { SlotStatus } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'

export type SlotDocument = HydratedDocument<Slot>

@Schema({
  timestamps: false,
})
export class Slot {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Date, required: true })
  startTime: Date

  @Prop({ type: Date, required: true })
  endTime: Date

  @Prop({
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE
  })
  status: SlotStatus

  @Prop({ type: Types.ObjectId, ref: Course.name })
  courseId: Types.ObjectId
}

export const SlotSchema = SchemaFactory.createForClass(Slot)
