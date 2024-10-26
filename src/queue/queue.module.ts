import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConnectionOptions } from 'bullmq'
import { QueueName } from './contracts/constant'
import { ClassRequestQueueConsumer } from './services/class-request.queue-consumer'
import { IQueueProducerService, QueueProducerService } from './services/queue-producer.service'

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
    )
  ],
  controllers: [],
  providers: [
    ClassRequestQueueConsumer,
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
