import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Transform } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'

export type AssignmentDocument = HydratedDocument<Assignment>

@Schema({
  // _id: false,
  // collection: 'assignments',
  timestamps: false,
})
export class Assignment {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: BaseMediaDto, required: true })
  attachment: BaseMediaDto
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment)
