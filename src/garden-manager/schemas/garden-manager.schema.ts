import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { GardenManagerStatus } from '@common/contracts/constant'

export type GardenManagerDocument = HydratedDocument<GardenManager>

@Schema({
  collection: 'garden-managers',
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
export class GardenManager {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true, select: false })
  password: string

  @Prop({ type: String, required: true })
  idCardPhoto: string

  @Prop({
    enum: GardenManagerStatus,
    default: GardenManagerStatus.ACTIVE
  })
  status: GardenManagerStatus
}

export const GardenManagerSchema = SchemaFactory.createForClass(GardenManager)

GardenManagerSchema.plugin(paginate)

GardenManagerSchema.index({ email: 1 })
GardenManagerSchema.index({ name: 'text', email: 'text' })

GardenManagerSchema.virtual('gardens', {
  ref: 'Garden',
  localField: '_id',
  foreignField: 'gardenManagerId'
})
