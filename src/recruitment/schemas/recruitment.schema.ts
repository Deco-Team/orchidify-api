import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { RecruitmentStatus, UserRole } from '@common/contracts/constant'

class ApplicationInfo {
  @Prop({ type: String })
  name: string

  @Prop({ type: String })
  email: string

  @Prop({ type: String })
  phone: string

  @Prop({ type: String })
  cv: string

  @Prop({ type: String })
  note: string
}

class RecruitmentStatusHistory {
  @Prop({ enum: RecruitmentStatus, required: true })
  status: RecruitmentStatus

  @Prop({ type: Date, required: true })
  timestamp: Date

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole })
  userRole: UserRole
}

export type RecruitmentDocument = HydratedDocument<Recruitment>

@Schema({
  collection: 'recruitments',
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
export class Recruitment {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: ApplicationInfo, required: true })
  applicationInfo: ApplicationInfo

  @Prop({ type: String })
  meetingUrl: string

  @Prop({
    enum: RecruitmentStatus,
    default: RecruitmentStatus.PENDING
  })
  status: RecruitmentStatus

  @Prop({ type: [RecruitmentStatusHistory] })
  histories: RecruitmentStatusHistory[]

  @Prop({ type: String })
  rejectReason: string

  @Prop({ type: Types.ObjectId })
  handledBy: Types.ObjectId
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment)

RecruitmentSchema.plugin(paginate)
RecruitmentSchema.index({ 'applicationInfo.name': 'text', 'applicationInfo.email': 'text' })