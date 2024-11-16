import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Notification, NotificationDocument } from '@notification/schemas/notification.schema'
import { AbstractRepository } from '@common/repositories'

export const INotificationRepository = Symbol('INotificationRepository')

export interface INotificationRepository extends AbstractRepository<NotificationDocument> {}

@Injectable()
export class NotificationRepository extends AbstractRepository<NotificationDocument> implements INotificationRepository {
  constructor(@InjectModel(Notification.name) model: PaginateModel<NotificationDocument>) {
    super(model)
  }
}
