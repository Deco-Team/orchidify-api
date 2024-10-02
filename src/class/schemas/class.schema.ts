import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { ClassStatus, UserRole } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Lesson, LessonSchema } from './lesson.schema'
import { Assignment, AssignmentSchema } from './assignment.schema'
import { CourseLevel } from '@src/common/contracts/constant'

export type ClassDocument = HydratedDocument<Class>

export class ClassStatusHistory {
  @Prop({ enum: ClassStatus, required: true })
  status: ClassStatus

  @Prop({ type: Date, required: true })
  timestamp: Date

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole })
  userRole: UserRole
}

@Schema({
  collection: 'classes',
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
export class Class {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Date })
  startDate: Date

  @Prop({ type: Number, required: true })
  price: number

  @Prop({ enum: CourseLevel, required: true })
  level: string

  @Prop({ type: String, required: true })
  type: string

  @Prop({ type: Number })
  duration: number

  @Prop({ type: String, required: true })
  thumbnail: string

  @Prop({ type: [BaseMediaDto], required: true })
  media: BaseMediaDto[]

  @Prop({
    enum: ClassStatus,
    default: ClassStatus.PUBLISHED
  })
  status: ClassStatus

  @Prop({
    type: [ClassStatusHistory]
  })
  histories: ClassStatusHistory[]

  @Prop({ type: Number })
  learnerLimit: number

  @Prop({ type: Number })
  learnerQuantity: number

  @Prop({ type: String })
  rate: string

  @Prop({ type: String })
  cancelReason: string

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  instructorId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Garden.name })
  gardenId: Types.ObjectId

  @Prop({ type: [LessonSchema], select: false })
  lessons: Lesson[]

  @Prop({ type: [AssignmentSchema], select: false })
  assignments: Assignment[]
}

export const ClassSchema = SchemaFactory.createForClass(Class)
ClassSchema.plugin(paginate)
// ClassSchema.index({ instructorId: 1 })
