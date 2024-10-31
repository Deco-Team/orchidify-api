import { SlotNumber } from '@common/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { JobName, JobSchedulerKey, QueueName } from '@queue/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { Job, JobsOptions, Queue } from 'bullmq'

export const IQueueProducerService = Symbol('IQueueProducerService')

export interface IQueueProducerService {
  addJob(queueName: QueueName, jobName: JobName, data: any, opts?: JobsOptions): Promise<Job>
  getJob(queueName: QueueName, jobId: string): Promise<Job | null>
  removeJob(queueName: QueueName, jobId: string): Promise<void>
}

@Injectable()
export class QueueProducerService implements IQueueProducerService, OnModuleInit {
  private readonly appLogger = new AppLogger(QueueProducerService.name)
  private queueMap: Map<QueueName, Queue>
  constructor(
    @InjectQueue(QueueName.CLASS_REQUEST) private readonly classRequestQueue: Queue,
    @InjectQueue(QueueName.PAYOUT_REQUEST) private readonly payoutRequestQueue: Queue,
    @InjectQueue(QueueName.RECRUITMENT) private readonly recruitmentQueue: Queue,
    @InjectQueue(QueueName.CLASS) private readonly classQueue: Queue,
    @InjectQueue(QueueName.SLOT) private readonly slotQueue: Queue
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'local') {
      await this.scheduleUpdateClassStatusJob()
      await this.scheduleUpdateClassProgressJob()
    }
    
    // Inject all queue to queueMap
    this.queueMap = new Map<QueueName, Queue>()
    this.queueMap.set(QueueName.CLASS_REQUEST, this.classRequestQueue)
    this.queueMap.set(QueueName.PAYOUT_REQUEST, this.payoutRequestQueue)
    this.queueMap.set(QueueName.RECRUITMENT, this.recruitmentQueue)
    this.queueMap.set(QueueName.CLASS, this.classQueue)
    this.queueMap.set(QueueName.SLOT, this.slotQueue)

    if ((await this.classRequestQueue.client).status !== 'ready') {
      throw Error('Redis service is not ready....')
    }
    this.appLogger.log(`Redis service is ready....`)

    this.countDelayedJobs()
    this.countJobSchedulers()
  }

  async addJob(queueName: QueueName, jobName: JobName, data: any, opts?: JobsOptions): Promise<Job> {
    // Retrieve queue
    const queue = this.queueMap.get(queueName)
    if (!queue) throw new Error('Queue not found')

    // Publish job
    const job = await queue.add(jobName, data, {
      backoff: 5000,
      ...opts
    })
    this.appLogger.debug(`Published job: jobId: ${job.id}, jobName: ${jobName} to queue: ${queueName}`)
    return job
  }

  async getJob(queueName: QueueName, jobId: string): Promise<Job | null> {
    return this.queueMap.get(QueueName[queueName]).getJob(jobId)
  }

  async removeJob(queueName: QueueName, jobId: string): Promise<void> {
    this.appLogger.debug(`Remove Job: jobId: ${jobId} from queue: ${queueName}`)
    await this.queueMap.get(QueueName[queueName]).remove(jobId)
  }

  private async countDelayedJobs() {
    this.appLogger.debug(
      `Queue: ${QueueName.PAYOUT_REQUEST}: Delayed Jobs Count = ${await this.payoutRequestQueue.getDelayedCount()}`
    )
    this.appLogger.debug(
      `Queue: ${QueueName.RECRUITMENT}: Delayed Jobs Count = ${await this.recruitmentQueue.getDelayedCount()}`
    )
    this.appLogger.debug(`Queue: ${QueueName.CLASS}: Delayed Jobs Count = ${await this.classQueue.getDelayedCount()}`)
    this.appLogger.debug(`Queue: ${QueueName.SLOT}: Delayed Jobs Count = ${await this.slotQueue.getDelayedCount()}`)
  }

  private async countJobSchedulers() {
    this.appLogger.debug(
      `Queue: ${QueueName.CLASS}: Scheduler Jobs Count = ${(await this.classQueue.getJobSchedulers()).length}`
    )
  }

  private async scheduleUpdateClassStatusJob(): Promise<void> {
    await this.classQueue.upsertJobScheduler(
      JobSchedulerKey.UpdateClassStatusScheduler,
      {
        pattern: '0 0 * * *',
        tz: VN_TIMEZONE
      },
      {
        name: JobName.UpdateClassStatusInProgress
      }
    )
  }

  private async scheduleUpdateClassProgressJob(): Promise<void> {
    await Promise.all([
      this.classQueue.upsertJobScheduler(
        JobSchedulerKey.UpdateClassProgressEndSlot1Scheduler,
        {
          pattern: '0 9 * * *',
          tz: VN_TIMEZONE
        },
        {
          name: JobName.UpdateClassProgressEndSlot,
          data: {
            slotNumber: SlotNumber.ONE
          }
        }
      ),
      this.classQueue.upsertJobScheduler(
        JobSchedulerKey.UpdateClassProgressEndSlot2Scheduler,
        {
          pattern: '30 11 * * *',
          tz: VN_TIMEZONE
        },
        {
          name: JobName.UpdateClassProgressEndSlot,
          data: {
            slotNumber: SlotNumber.TWO
          }
        }
      ),
      this.classQueue.upsertJobScheduler(
        JobSchedulerKey.UpdateClassProgressEndSlot3Scheduler,
        {
          pattern: '0 15 * * *',
          tz: VN_TIMEZONE
        },
        {
          name: JobName.UpdateClassProgressEndSlot,
          data: {
            slotNumber: SlotNumber.THREE
          }
        }
      ),
      this.classQueue.upsertJobScheduler(
        JobSchedulerKey.UpdateClassProgressEndSlot4Scheduler,
        {
          pattern: '30 17 * * *',
          tz: VN_TIMEZONE
        },
        {
          name: JobName.UpdateClassProgressEndSlot,
          data: {
            slotNumber: SlotNumber.FOUR
          }
        }
      )
    ])
  }
}
