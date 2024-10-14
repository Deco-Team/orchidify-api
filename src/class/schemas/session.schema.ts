import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Transform } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { Assignment, AssignmentSchema } from './assignment.schema'

export type SessionDocument = HydratedDocument<Session>

@Schema({
  timestamps: false,
})
export class Session {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Number, required: true })
  sessionNumber: number

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: [BaseMediaDto], required: true })
  media: BaseMediaDto[]
  
  @Prop({ type: [AssignmentSchema], select: false })
  assignments: Assignment[]
}

export const SessionSchema = SchemaFactory.createForClass(Session)
