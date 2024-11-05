import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Transform } from 'class-transformer'
import { Assignment, AssignmentSchema } from './assignment.schema'
import { SessionMediaDto } from '@class/dto/session.dto'

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

  @Prop({ type: [SessionMediaDto], required: true })
  media: SessionMediaDto[]
  
  @Prop({ type: [AssignmentSchema] })
  assignments: Assignment[]
}

export const SessionSchema = SchemaFactory.createForClass(Session)
