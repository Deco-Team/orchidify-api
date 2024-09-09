import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { GardenStatus } from '@common/contracts/constant'
import { GardenManager } from '@garden-manager/schemas/garden-manager.schema'

export type GardenDocument = HydratedDocument<Garden>

@Schema({
  collection: 'gardens',
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
export class Garden {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, required: true })
  address: string

  @Prop({ type: [Array], required: true })
  images: String[]

  @Prop({
    enum: GardenStatus,
    default: GardenStatus.ACTIVE
  })
  status: GardenStatus

  @Prop({ type: Types.ObjectId, ref: GardenManager.name, required: true })
  gardenManagerId: Types.ObjectId | GardenManager
}

export const GardenSchema = SchemaFactory.createForClass(Garden)

GardenSchema.plugin(paginate)