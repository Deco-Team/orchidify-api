import { PickType } from '@nestjs/swagger'
import { BaseFeedbackDto } from './base.feedback.dto'
import { Types } from 'mongoose'

export class SendFeedbackDto extends PickType(BaseFeedbackDto, ['rate', 'comment']) {
  learnerId: Types.ObjectId
  classId: Types.ObjectId
  courseId: Types.ObjectId
}
