import { ApiProperty, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseNotificationDto } from '@notification/dto/base.notification.dto'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import { Types } from 'mongoose'
import { NOTIFICATION_LIST_PROJECTION } from '@notification/contracts/constant'

export class QueryNotificationDto {
  // slotId: Types.ObjectId
}

class NotificationLearnerDetailResponse extends PickType(BaseLearnerDto, ['_id', 'name', 'avatar']) {}

class NotificationListItemResponse extends PickType(BaseNotificationDto, NOTIFICATION_LIST_PROJECTION) {
  // @ApiProperty({ type: NotificationLearnerDetailResponse })
  // learner: NotificationLearnerDetailResponse
}
class NotificationListResponse {
  @ApiProperty({ type: NotificationListItemResponse, isArray: true })
  docs: NotificationListItemResponse[]
}
export class NotificationListDataResponse extends DataResponse(NotificationListResponse) {}
