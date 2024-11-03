import * as moment from 'moment-timezone'
import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { AppLogger } from '@common/services/app-logger.service'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { JobName, QueueName } from '@queue/contracts/constant'
import { Job } from 'bullmq'
import { VN_TIMEZONE } from '@src/config'
import { IRecruitmentService } from '@recruitment/services/recruitment.service'

@Processor(QueueName.RECRUITMENT)
export class RecruitmentQueueConsumer extends WorkerHost {
  private readonly appLogger = new AppLogger(RecruitmentQueueConsumer.name)
  constructor(
    @Inject(IRecruitmentService)
    private readonly recruitmentService: IRecruitmentService
  ) {
    super()
  }

  async process(job: Job<any>): Promise<any> {
    this.appLogger.log(`[process] Processing job id=${job.id}`)
    try {
      switch (job.name) {
        case JobName.RecruitmentAutoExpired: {
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
    if (!isExpired) return 'Recruitment not expired yet'

    try {
      this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`)
      const recruitment = await this.recruitmentService.findById(job.id)
      if (!recruitment) return Errors.RECRUITMENT_NOT_FOUND.error

      await this.recruitmentService.expiredRecruitmentProcess(job.id, { role: 'SYSTEM' as UserRole })

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
