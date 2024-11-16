import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { ClassRequestStatus, ClassRequestType, UserRole } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Class } from '@class/schemas/class.schema'
import { Course } from '@course/schemas/course.schema'

export type ClassRequestDocument = HydratedDocument<ClassRequest>

export class ClassRequestStatusHistory {
  @Prop({ enum: ClassRequestStatus, required: true })
  status: ClassRequestStatus

  @Prop({ type: Date, required: true })
  timestamp: Date

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole })
  userRole: UserRole
}

@Schema({
  collection: 'class-requests',
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
export class ClassRequest {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true, enum: ClassRequestType })
  type: ClassRequestType

  @Prop({
    enum: ClassRequestStatus,
    default: ClassRequestStatus.PENDING
  })
  status: ClassRequestStatus

  @Prop({ type: String })
  rejectReason: string

  @Prop({
    type: [ClassRequestStatusHistory]
  })
  histories: ClassRequestStatusHistory[]

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Types.Map })
  metadata: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Course.name })
  courseId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Class.name })
  classId: Types.ObjectId
}

export const ClassRequestSchema = SchemaFactory.createForClass(ClassRequest)
ClassRequestSchema.plugin(paginate)
// ClassRequestSchema.index({ createdBy: 1 })
ClassRequestSchema.virtual('class', {
  ref: 'Class',
  localField: 'classId',
  foreignField: '_id',
  justOne: true
})
