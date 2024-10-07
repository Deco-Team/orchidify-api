import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { SlotNumber, SlotStatus } from '@common/contracts/constant'
import { Class } from '@src/class/schemas/class.schema'

export type SlotDocument = HydratedDocument<Slot>

@Schema({
  timestamps: false
})
export class Slot {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Number, required: true, enum: SlotNumber })
  slotNumber: SlotNumber

  @Prop({ type: Date, required: true })
  start: Date

  @Prop({ type: Date, required: true })
  end: Date

  @Prop({
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE
  })
  status: SlotStatus

  @Prop({ type: Types.ObjectId, ref: Class.name })
  classId: Types.ObjectId
}

export const SlotSchema = SchemaFactory.createForClass(Slot)
