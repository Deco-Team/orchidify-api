import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Transform } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'

export type LessonDocument = HydratedDocument<Lesson>

@Schema({
  // _id: false,
  // collection: 'lessons',
  timestamps: false,
})
export class Lesson {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: [BaseMediaDto], required: true })
  media: BaseMediaDto[]
}

export const LessonSchema = SchemaFactory.createForClass(Lesson)
