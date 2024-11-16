import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { INotificationRepository } from '@notification/repositories/notification.repository'
import { Notification, NotificationDocument } from '@notification/schemas/notification.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateNotificationDto } from '@notification/dto/create-notification.dto'
import { QueryNotificationDto } from '@notification/dto/view-notification.dto'
import { NOTIFICATION_LIST_PROJECTION } from '@notification/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { IFirebaseAuthService } from '@firebase/services/firebase.auth.service'

export const INotificationService = Symbol('INotificationService')

export interface INotificationService {
  create(createNotificationDto: CreateNotificationDto, options?: SaveOptions | undefined): Promise<NotificationDocument>
  findById(
    notificationId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<NotificationDocument>
  findOneBy(
    conditions: FilterQuery<Notification>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<NotificationDocument>
  findMany(
    conditions: FilterQuery<NotificationDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<NotificationDocument[]>
  update(
    conditions: FilterQuery<Notification>,
    payload: UpdateQuery<Notification>,
    options?: QueryOptions | undefined
  ): Promise<NotificationDocument>
  // list(
  //   queryNotificationDto: QueryNotificationDto,
  //   projection?: string | Record<string, any>,
  //   populate?: Array<PopulateOptions>
  // )
}

@Injectable()
export class NotificationService implements INotificationService {
  private readonly appLogger = new AppLogger(NotificationService.name)
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IFirebaseAuthService)
    private readonly firebaseService: IFirebaseAuthService
  ) {}

  public async create(createNotificationDto: CreateNotificationDto, options?: SaveOptions | undefined) {
    // call firebase messaging
    
    return await this.notificationRepository.create({ ...createNotificationDto }, options)
  }

  public async update(
    conditions: FilterQuery<Notification>,
    payload: UpdateQuery<Notification>,
    options?: QueryOptions | undefined
  ) {
    return await this.notificationRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findById(
    notificationId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const notification = await this.notificationRepository.findOne({
      conditions: {
        _id: notificationId
      },
      projection,
      populates
    })
    return notification
  }

  public async findOneBy(
    conditions: FilterQuery<Notification>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const notification = await this.notificationRepository.findOne({
      conditions,
      projection,
      populates
    })
    return notification
  }

  public async findMany(
    conditions: FilterQuery<NotificationDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const notifications = await this.notificationRepository.findMany({
      conditions,
      projection,
      populates
    })
    return notifications
  }

  // async list(
  //   queryCourseDto: QueryNotificationDto,
  //   projection = NOTIFICATION_LIST_PROJECTION,
  //   populate?: Array<PopulateOptions>
  // ) {
  //   const { slotId } = queryCourseDto
  //   const filter: Record<string, any> = {}
  //   if (slotId) {
  //     filter['slotId'] = slotId
  //   }

  //   // const validStatus = status?.filter((status) =>
  //   //   [NotificationStatus.ACTIVE, NotificationStatus.INACTIVE].includes(status)
  //   // )
  //   // if (validStatus?.length > 0) {
  //   //   filter['status'] = {
  //   //     $in: validStatus
  //   //   }
  //   // }

  //   return this.notificationRepository.model.paginate(filter, {
  //     // ...pagination,
  //     projection,
  //     populate
  //   })
  // }
}
