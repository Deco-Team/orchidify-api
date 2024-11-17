import { PickType } from '@nestjs/swagger'
import { BaseNotificationDto } from './base.notification.dto'

export class SendNotificationDto extends PickType(BaseNotificationDto, [
  'title',
  'body',
  'data',
  'receiverIds',
  'createdAt'
]) {}
