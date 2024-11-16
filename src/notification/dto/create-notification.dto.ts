import { PickType } from '@nestjs/swagger'
import { BaseNotificationDto } from './base.notification.dto'

export class CreateNotificationDto extends PickType(BaseNotificationDto, ['title', 'body', 'data']) {}
