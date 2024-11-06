import * as moment from 'moment-timezone'
import { ClassStatus, SlotNumber, SlotStatus, UserRole } from '@common/contracts/constant'
import { AppLogger } from '@common/services/app-logger.service'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { JobName, QueueName } from '@queue/contracts/constant'
import { Job } from 'bullmq'
import { VN_TIMEZONE } from '@src/config'
import { IClassService } from '@class/services/class.service'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'

@Processor(QueueName.CLASS)
export class ClassQueueConsumer extends WorkerHost {
  private readonly appLogger = new AppLogger(ClassQueueConsumer.name)
  constructor(
    @Inject(IClassService)
    private readonly classService: IClassService,
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService
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
        case JobName.UpdateClassProgressEndSlot: {
          return await this.updateClassProgressEndSlot(job)
        }
        case JobName.ClassAutoCompleted: {
          return await this.completeClassAutomatically(job)
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

  async updateClassProgressEndSlot(job: Job) {
    const { slotNumber } = job.data
    this.appLogger.debug(
      `[updateClassProgressEndSlot]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`
    )

    try {
      this.appLogger.log(`[updateClassProgressEndSlot]: Start update class progress... id=${job.id}`)

      const startOfDate = moment().tz(VN_TIMEZONE).startOf('date')
      let start, end: Date
      switch (slotNumber) {
        case SlotNumber.ONE:
          start = startOfDate.clone().add(7, 'hour').toDate()
          end = startOfDate.clone().add(9, 'hour').toDate()
          break
        case SlotNumber.TWO:
          start = startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate()
          end = startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate()
          break
        case SlotNumber.THREE:
          start = startOfDate.clone().add(13, 'hour').toDate()
          end = startOfDate.clone().add(15, 'hour').toDate()
          break
        case SlotNumber.FOUR:
          start = startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate()
          end = startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate()
          break
      }

      const timesheets = await this.gardenTimesheetService.findMany({
        'slots.start': start,
        'slots.end': end
      })

      const classIds = new Set()
      for (const timesheet of timesheets) {
        for (const slot of timesheet.slots) {
          if (slot.status === SlotStatus.NOT_AVAILABLE && slot.slotNumber === slotNumber) {
            classIds.add(slot.classId)
          }
        }
      }
      const courseClasses = await this.classService.findMany({
        _id: {
          $in: [...classIds]
        }
      })

      const updateClassProgressPromises = []
      courseClasses.forEach((courseClass) => {
        const completed = courseClass.progress.completed + 1
        const total = courseClass.progress.total
        const percentage = Math.round((completed / total) * 100)
        updateClassProgressPromises.push(
          this.classService.update(
            { _id: courseClass._id },
            {
              $set: { progress: { completed, total, percentage } }
            }
          )
        )
      })
      await Promise.all(updateClassProgressPromises)

      this.appLogger.log(`[updateClassProgressEndSlot]: End update class progress... id=${job.id}`)
      return { status: true, numbersOfUpdatedClass: classIds.size }
    } catch (error) {
      this.appLogger.error(
        `[updateClassProgressEndSlot]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(
          job.data
        )}, error=${error}`
      )
      return false
    }
  }

  async completeClassAutomatically(job: Job) {
    this.appLogger.debug(
      `[completeClassAutomatically]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`
    )

    try {
      this.appLogger.log(`[completeClassAutomatically]: Start complete class ... id=${job.id}`)

      const startOfDate = moment().tz(VN_TIMEZONE).startOf('date')
      const classAutoCompleteAfterDay =
        Number((await this.settingService.findByKey(SettingKey.ClassAutoCompleteAfterDay)).value) || 5

      const courseClasses = await this.classService.findMany({
        status: ClassStatus.IN_PROGRESS
      })

      const completeClassPromises = []
      courseClasses.forEach((courseClass) => {
        const { startDate, duration, weekdays } = courseClass
        const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays })

        if (classEndTime.clone().add(classAutoCompleteAfterDay, 'day').isSameOrAfter(startOfDate)) {
          completeClassPromises.push(this.classService.completeClass(courseClass._id, { role: 'SYSTEM' as UserRole }))
        }
      })
      await Promise.all(completeClassPromises)

      this.appLogger.log(`[completeClassAutomatically]: End complete class... id=${job.id}`)
      return { status: true, numbersOfCompletedClass: completeClassPromises.length }
    } catch (error) {
      this.appLogger.error(
        `[completeClassAutomatically]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(
          job.data
        )}, error=${error}`
      )
      return false
    }
  }
}
