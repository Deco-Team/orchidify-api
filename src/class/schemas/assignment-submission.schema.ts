import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Assignment } from './assignment.schema'
import { Learner } from '@learner/schemas/learner.schema'
import { SubmissionStatus } from '@common/contracts/constant'

export type AssignmentSubmissionDocument = HydratedDocument<AssignmentSubmission>

@Schema({
  collection: 'assignment-submissions',
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
export class AssignmentSubmission {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: [BaseMediaDto], required: true })
  attachments: BaseMediaDto[]

  @Prop({ type: Number })
  point: number

  @Prop({ type: String })
  feedback: string

  @Prop({ type: String, enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus

  @Prop({ type: Types.ObjectId, ref: Assignment.name, required: true })
  assignmentId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Learner.name, required: true })
  learnerId: Types.ObjectId
}

export const AssignmentSubmissionSchema = SchemaFactory.createForClass(AssignmentSubmission)
AssignmentSubmissionSchema.index({ assignmentId: 1, learnerId: 1 })