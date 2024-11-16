import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Notification, NotificationSchema } from '@notification/schemas/notification.schema'
import { INotificationRepository, NotificationRepository } from '@notification/repositories/notification.repository'
import { INotificationService, NotificationService } from '@notification/services/notification.service'
import { NotificationController } from './controllers/notification.controller'
import { IUserDeviceService, UserDeviceService } from './services/user-device.service'
import { IUserDeviceRepository, UserDeviceRepository } from './repositories/user-device.repository'
import { UserDeviceController } from './controllers/user-device.controller'
import { FirebaseModule } from '@firebase/firebase.module'
import { UserDevice, UserDeviceSchema } from './schemas/user-device.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: UserDevice.name, schema: UserDeviceSchema }
    ]),
    FirebaseModule
  ],
  controllers: [NotificationController, UserDeviceController],
  providers: [
    {
      provide: INotificationService,
      useClass: NotificationService
    },
    {
      provide: INotificationRepository,
      useClass: NotificationRepository
    },
    {
      provide: IUserDeviceService,
      useClass: UserDeviceService
    },
    {
      provide: IUserDeviceRepository,
      useClass: UserDeviceRepository
    }
  ],
  exports: [
    {
      provide: INotificationService,
      useClass: NotificationService
    },
    {
      provide: IUserDeviceService,
      useClass: UserDeviceService
    }
  ]
})
export class NotificationModule {}
