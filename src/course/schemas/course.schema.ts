import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { CourseStatus } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Lesson, LessonSchema } from '@src/class/schemas/lesson.schema'
import { Assignment, AssignmentSchema } from '@src/class/schemas/assignment.schema'
import { CourseLevel } from '@src/common/contracts/constant'

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

  @Prop({ type: String })
  thumbnail: string

  @Prop({ type: [BaseMediaDto] })
  media: BaseMediaDto[]

  @Prop({
    enum: CourseStatus,
    default: CourseStatus.DRAFT
  })
  status: CourseStatus

  @Prop({ type: [LessonSchema], select: false })
  lessons: Lesson[]

  @Prop({ type: [AssignmentSchema], select: false })
  assignments: Assignment[]

  @Prop({ type: [{ type: Types.ObjectId, ref: Course.name }] })
  childCourseIds: Types.ObjectId[]

  @Prop({ type: Number })
  learnerLimit: number

  @Prop({ type: Number })
  rate: number

  @Prop({ type: Number })
  discount: number

  @Prop({ type: String })
  gardenRequiredToolkits: string

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  instructorId: Types.ObjectId

  @Prop({ type: Boolean, default: false })
  isPublished: boolean
}

export const CourseSchema = SchemaFactory.createForClass(Course)
CourseSchema.plugin(paginate)
CourseSchema.index({ title: 'text', type: 'text' })

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
