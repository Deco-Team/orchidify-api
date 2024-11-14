import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConnectionOptions } from 'bullmq'
import { QueueName } from './contracts/constant'
import { ClassRequestQueueConsumer } from './services/class-request.queue-consumer'
import { IQueueProducerService, QueueProducerService } from './services/queue-producer.service'
import { ClassQueueConsumer } from './services/class.queue-consumer'
import { RecruitmentModule } from '@recruitment/recruitment.module'
import { RecruitmentQueueConsumer } from './services/recruitment.queue-consumer'
import { CertificateModule } from '@certificate/certificate.module'
import { MediaModule } from '@media/media.module'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: configService.get<ConnectionOptions>('redis'),
        prefix: 'orchidify',
        defaultJobOptions: {
          attempts: 3
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue(
      {
        name: QueueName.CLASS_REQUEST
      },
      {
        name: QueueName.PAYOUT_REQUEST
      },
      {
        name: QueueName.RECRUITMENT
      },
      {
        name: QueueName.CLASS
      },
      {
        name: QueueName.SLOT
      }
    ),
    RecruitmentModule,
    CertificateModule,
    MediaModule
  ],
  controllers: [],
  providers: [
    ClassRequestQueueConsumer,
    ClassQueueConsumer,
    RecruitmentQueueConsumer,
    {
      provide: IQueueProducerService,
      useClass: QueueProducerService
    }
  ],
  exports: [
    {
      provide: IQueueProducerService,
      useClass: QueueProducerService
    }
  ]
})
export class QueueModule {}
