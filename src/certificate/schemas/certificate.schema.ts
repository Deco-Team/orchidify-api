import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { UserRole } from '@common/contracts/constant'

export type CertificateDocument = HydratedDocument<Certificate>

@Schema({
  collection: 'certificates',
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
export class Certificate {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String })
  name: string

  @Prop({ type: String })
  code: string

  @Prop({ type: String, required: true })
  url: string

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate)

CertificateSchema.plugin(paginate)
// CertificateSchema.index({ code: 1 })
