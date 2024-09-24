import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { CourseTemplateStatus } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Lesson, LessonSchema } from '@course/schemas/lesson.schema'
import { Assignment, AssignmentSchema } from '@course/schemas/assignment.schema'
import { CourseLevel } from '@course/contracts/constant'

export type CourseTemplateDocument = HydratedDocument<CourseTemplate>

@Schema({
  collection: 'course-templates',
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
export class CourseTemplate {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Number, required: true })
  price: number

  @Prop({ required: true, enum: CourseLevel })
  level: string

  @Prop({ type: String, required: true })
  type: string

  @Prop({ type: String, required: true })
  thumbnail: string

  @Prop({ type: [BaseMediaDto], required: true })
  media: BaseMediaDto[]

  @Prop({
    enum: CourseTemplateStatus,
    default: CourseTemplateStatus.DRAFT
  })
  status: CourseTemplateStatus

  @Prop({ type: Number })
  learnerLimit: number

  @Prop({ type: String })
  rate: string

  @Prop({ type: Types.ObjectId, ref: Instructor.name, required: true })
  instructorId: Types.ObjectId

  @Prop({ type: [LessonSchema], select: false })
  lessons: Lesson[]

  @Prop({ type: [AssignmentSchema], select: false })
  assignments: Assignment[]
}

export const CourseTemplateSchema = SchemaFactory.createForClass(CourseTemplate)
CourseTemplateSchema.plugin(paginate)
CourseTemplateSchema.index({ title: 'text', type: 'text'})
