import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { StaffStatus, UserRole } from '@common/contracts/constant'

export type StaffDocument = HydratedDocument<Staff>

@Schema({
  collection: 'staffs',
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
export class Staff {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true })
  staffCode: string

  @Prop({ type: String, required: true, select: false })
  password: string

  @Prop({
    enum: StaffStatus,
    default: StaffStatus.ACTIVE
  })
  status: StaffStatus

  @Prop({ type: String, required: true })
  idCardPhoto: string

  @Prop({
    enum: [UserRole.ADMIN, UserRole.STAFF],
    default: UserRole.STAFF
  })
  role: UserRole.ADMIN | UserRole.STAFF
}

export const StaffSchema = SchemaFactory.createForClass(Staff)

StaffSchema.plugin(paginate)
StaffSchema.index({ email: 1 })
