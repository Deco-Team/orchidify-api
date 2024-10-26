import * as moment from 'moment-timezone'
import { IClassRequestService } from '@class-request/services/class-request.service'
import { ClassRequestStatus, ClassRequestType, UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { AppLogger } from '@common/services/app-logger.service'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { JobName, QueueName } from '@queue/contracts/constant'
import { Job } from 'bullmq'
import { VN_TIMEZONE } from '@src/config'

@Processor(QueueName.CLASS_REQUEST)
export class ClassRequestQueueConsumer extends WorkerHost {
  private readonly appLogger = new AppLogger(ClassRequestQueueConsumer.name)
  constructor(
    @Inject(IClassRequestService)
    private readonly classRequestService: IClassRequestService
  ) {
    super()
  }

  async process(job: Job<any>): Promise<any> {
    this.appLogger.log(`[process] Processing job id=${job.id}`)
    try {
      switch (job.name) {
        case JobName.ClassRequestAutoExpired: {
          return await this.updateStatusToExpired(job)
        }
        // case 'concatenate': {
        //   // await doSomeLogic2();
        //   break
        // }
        default:
      }
      this.appLogger.log('[process] Job processed successfully')
    } catch (error) {
      this.appLogger.error(error)
      throw error // Re-queue job in case of failure
    }
  }

  async updateStatusToExpired(job: Job) {
    this.appLogger.debug(`[updateStatusToExpired]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`)
    
    // check expired time
    const { expiredAt } = job.data
    const isExpired = moment.tz(VN_TIMEZONE).isSameOrAfter(moment.tz(expiredAt, VN_TIMEZONE))
    if (!isExpired) return 'Class Request not expired yet'

    try {
      this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`)
      const classRequest = await this.classRequestService.findById(job.id)
      if (!classRequest) return Errors.CLASS_REQUEST_NOT_FOUND.error

      if (classRequest.type === ClassRequestType.PUBLISH_CLASS) {
        await this.classRequestService.expirePublishClassRequest(job.id, { role: 'SYSTEM' as UserRole })
      }

      this.appLogger.log(`[updateStatusToExpired]: End update status... id=${job.id}`)
      return true
    } catch (error) {
      this.appLogger.error(
        `[updateStatusToExpired]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(
          job.data
        )}, error=${error}`
      )
      return false
    }
  }
}
