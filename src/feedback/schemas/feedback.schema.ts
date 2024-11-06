import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { Learner } from '@learner/schemas/learner.schema'
import { Class } from '@class/schemas/class.schema'
import { Course } from '@course/schemas/course.schema'

export type FeedbackDocument = HydratedDocument<Feedback>

@Schema({
  collection: 'feedbacks',
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
export class Feedback {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Number, required: true })
  rate: number

  @Prop({ type: String })
  comment: string

  @Prop({ type: Types.ObjectId, ref: Learner.name, required: true })
  learnerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Class.name, required: true })
  classId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true })
  courseId: Types.ObjectId
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)

FeedbackSchema.plugin(paginate)

FeedbackSchema.index({  learnerId: 1, classId: 1, courseId: 1 })

FeedbackSchema.virtual('learner', {
  ref: 'Learner',
  localField: 'learnerId',
  foreignField: '_id',
  justOne: true
})
