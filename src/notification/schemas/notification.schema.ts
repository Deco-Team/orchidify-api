import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({
  collection: 'notifications',
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
export class Notification {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String })
  title: string

  @Prop({ type: String })
  body: string

  @Prop({ type: Types.Map })
  data: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
NotificationSchema.plugin(paginate)
