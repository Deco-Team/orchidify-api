import * as moment from 'moment-timezone'
import { IPayoutRequestService } from '@payout-request/services/payout-request.service'
import { PayoutRequestStatus, UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { AppLogger } from '@common/services/app-logger.service'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { JobName, QueueName } from '@queue/contracts/constant'
import { Job } from 'bullmq'
import { VN_TIMEZONE } from '@src/config'

@Processor(QueueName.PAYOUT_REQUEST)
export class PayoutRequestQueueConsumer extends WorkerHost {
  private readonly appLogger = new AppLogger(PayoutRequestQueueConsumer.name)
  constructor(
    @Inject(IPayoutRequestService)
    private readonly payoutRequestService: IPayoutRequestService
  ) {
    super()
  }

  async process(job: Job<any>): Promise<any> {
    this.appLogger.log(`[process] Processing job id=${job.id}`)
    try {
      switch (job.name) {
        case JobName.PayoutRequestAutoExpired: {
          return await this.updateStatusToExpired(job)
        }
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
    if (!isExpired) return 'Payout Request not expired yet'

    try {
      this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`)
      const payoutRequest = await this.payoutRequestService.findById(job.id)
      if (!payoutRequest) return Errors.CLASS_REQUEST_NOT_FOUND.error

      await this.payoutRequestService.expirePayoutRequest(job.id, { role: 'SYSTEM' as UserRole })

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
