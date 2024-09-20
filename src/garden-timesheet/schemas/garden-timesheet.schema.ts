import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { GardenTimesheetStatus } from '@common/contracts/constant'
import { Garden } from '@garden/schemas/garden.schema'
import { Slot, SlotSchema } from './slot.schema'

export type GardenTimesheetDocument = HydratedDocument<GardenTimesheet>

@Schema({
  collection: 'garden-timesheets',
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
export class GardenTimesheet {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({
    enum: GardenTimesheetStatus,
    default: GardenTimesheetStatus.ACTIVE
  })
  status: GardenTimesheetStatus

  @Prop({ type: Date, required: true })
  date: Date

  @Prop({ type: Types.ObjectId, ref: Garden.name, required: true })
  gardenId: Types.ObjectId

  @Prop({ type: [SlotSchema] })
  slots: Slot[]
}

export const GardenTimesheetSchema = SchemaFactory.createForClass(GardenTimesheet)
GardenTimesheetSchema.plugin(paginate)
GardenTimesheetSchema.index({ gardenId: 1, date: 1 }, { unique: true })
