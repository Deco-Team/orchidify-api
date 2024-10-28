import * as moment from 'moment-timezone'
import { ClassStatus, UserRole } from '@common/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { JobName, QueueName } from '@queue/contracts/constant'
import { Job } from 'bullmq'
import { VN_TIMEZONE } from '@src/config'
import { IClassService } from '@class/services/class.service'

@Processor(QueueName.CLASS)
export class ClassQueueConsumer extends WorkerHost {
  private readonly appLogger = new AppLogger(ClassQueueConsumer.name)
  constructor(
    @Inject(IClassService)
    private readonly classService: IClassService
  ) {
    super()
  }

  async process(job: Job<any>): Promise<any> {
    this.appLogger.log(`[process] Processing job id=${job.id}`)
    try {
      switch (job.name) {
        case JobName.UpdateClassStatusInProgress: {
          return await this.updateClassStatusInProgress(job)
        }
        default:
      }
      this.appLogger.log('[process] Job processed successfully')
    } catch (error) {
      this.appLogger.error(error)
      throw error // Re-queue job in case of failure
    }
  }

  async updateClassStatusInProgress(job: Job) {
    this.appLogger.debug(
      `[updateClassStatusInProgress]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`
    )

    try {
      this.appLogger.log(`[updateClassStatusInProgress]: Start update class status... id=${job.id}`)
      const courseClasses = await this.classService.findManyByStatus([ClassStatus.PUBLISHED])
      if (courseClasses.length === 0) return 'No PUBLISHED status class'

      const nowMoment = moment().tz(VN_TIMEZONE).startOf('date')
      const updateClassStatusPromises = []
      courseClasses.forEach((courseClass) => {
        const startOfDate = moment(courseClass.startDate).tz(VN_TIMEZONE).startOf('date')
        if (startOfDate.isSameOrBefore(nowMoment)) {
          updateClassStatusPromises.push(
            this.classService.update(
              { _id: courseClass._id },
              {
                $set: { status: ClassStatus.IN_PROGRESS },
                $push: {
                  histories: {
                    status: ClassStatus.IN_PROGRESS,
                    timestamp: new Date(),
                    userRole: 'SYSTEM' as UserRole
                  }
                }
              }
            )
          )
        }
      })
      await Promise.all(updateClassStatusPromises)

      this.appLogger.log(`[updateClassStatusInProgress]: End update status... id=${job.id}`)
      return { status: true, numbersOfUpdatedClass: updateClassStatusPromises.length }
    } catch (error) {
      this.appLogger.error(
        `[updateClassStatusInProgress]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(
          job.data
        )}, error=${error}`
      )
      return false
    }
  }
}
