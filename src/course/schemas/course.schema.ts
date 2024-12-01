import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { CourseStatus } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Session, SessionSchema } from '@class/schemas/session.schema'
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto'

export type CourseDocument = HydratedDocument<Course>

@Schema({
  collection: 'courses',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    },
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Course {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  code: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Number })
  price: number

  @Prop({ enum: CourseLevel })
  level: string

  @Prop({ type: [String] })
  type: string[]

  @Prop({ type: Number })
  duration: number

  @Prop({ type: String })
  thumbnail: string

  @Prop({ type: [BaseMediaDto] })
  media: BaseMediaDto[]

  @Prop({
    enum: CourseStatus,
    default: CourseStatus.DRAFT
  })
  status: CourseStatus

  @Prop({ type: [SessionSchema], select: false })
  sessions: Session[]

  @Prop({ type: [{ type: Types.ObjectId, ref: Course.name }] })
  childCourseIds: Types.ObjectId[]

  @Prop({ type: Number })
  learnerLimit: number

  @Prop({ type: Number, default: 0 })
  learnerQuantity: number

  @Prop({ type: Number, default: 0 })
  rate: number

  @Prop({ type: Number })
  discount: number

  @Prop({ type: String })
  gardenRequiredToolkits: string

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  instructorId: Types.ObjectId

  @Prop({ type: Boolean, default: false })
  isRequesting: boolean

  @Prop({ type: BaseRatingSummaryDto })
  ratingSummary: BaseRatingSummaryDto
}

export const CourseSchema = SchemaFactory.createForClass(Course)
CourseSchema.plugin(paginate)
CourseSchema.index({ title: 'text' })

CourseSchema.virtual('classes', {
  ref: 'Class',
  localField: '_id',
  foreignField: 'courseId'
})

CourseSchema.virtual('instructor', {
  ref: 'Instructor',
  localField: 'instructorId',
  foreignField: '_id',
  justOne: true
})

CourseSchema.virtual('childCourses', {
  ref: 'Course',
  localField: 'childCourseIds',
  foreignField: '_id'
})

CourseSchema.virtual('combos', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'childCourseIds'
})
