import { Injectable, Inject } from '@nestjs/common'
import * as moment from 'moment-timezone'
import * as _ from 'lodash'
import { IGardenTimesheetRepository } from '@garden-timesheet/repositories/garden-timesheet.repository'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto'
import { GardenTimesheetStatus, SLOT_NUMBERS, SlotNumber, SlotStatus, TimesheetType } from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { CreateGardenTimesheetDto } from '@garden-timesheet/dto/create-garden-timesheet.dto'
import { AppLogger } from '@src/common/services/app-logger.service'
import { VIEW_GARDEN_TIMESHEET_LIST_PROJECTION } from '@garden-timesheet/contracts/constant'
import { QueryAllGardenTimesheetDto } from '@garden-timesheet/dto/view-all-garden-timesheet.dto'
import { QueryAvailableTimeDto, ViewAvailableTimeResponse } from '@garden-timesheet/dto/view-available-timesheet.dto'
import { Slot } from '@garden-timesheet/schemas/slot.schema'
import { Garden } from '@garden/schemas/garden.schema'

export const IGardenTimesheetService = Symbol('IGardenTimesheetService')

export interface IGardenTimesheetService {
  findById(
    gardenTimesheetId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<GardenTimesheetDocument>
  update(
    conditions: FilterQuery<GardenTimesheet>,
    payload: UpdateQuery<GardenTimesheet>,
    options?: QueryOptions | undefined
  ): Promise<GardenTimesheetDocument>
  viewGardenTimesheetList(
    queryGardenTimesheetDto: QueryGardenTimesheetDto,
    garden: Garden
  ): Promise<GardenTimesheetDocument[]>
  viewAllGardenTimesheetList(queryAllGardenTimesheetDto: QueryAllGardenTimesheetDto): Promise<GardenTimesheetDocument[]>
  viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse>
}

@Injectable()
export class GardenTimesheetService implements IGardenTimesheetService {
  private readonly appLogger = new AppLogger(GardenTimesheetService.name)
  constructor(
    @Inject(IGardenTimesheetRepository)
    private readonly gardenTimesheetRepository: IGardenTimesheetRepository
  ) {}

  public async findById(
    gardenTimesheetId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
      conditions: {
        _id: gardenTimesheetId
      },
      projection,
      populates
    })
    return gardenTimesheet
  }

  public update(
    conditions: FilterQuery<GardenTimesheet>,
    payload: UpdateQuery<GardenTimesheet>,
    options?: QueryOptions | undefined
  ) {
    return this.gardenTimesheetRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async viewGardenTimesheetList(queryGardenTimesheetDto: QueryGardenTimesheetDto, garden: Garden) {
    const { type, gardenId, date } = queryGardenTimesheetDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewGardenTimesheetList: type=${type}, gardenId=${gardenId}, date=${date}`)

    // check month garden timesheet has been generated
    const existedGardenTimesheet = await this.gardenTimesheetRepository.findOne({
      conditions: {
        gardenId: new Types.ObjectId(gardenId),
        date: dateMoment.clone().startOf('month')
      }
    })
    if (!existedGardenTimesheet) {
      console.time(`generateTimesheetOfMonth: gardenId=${gardenId}, date=${date}`)
      await this.generateTimesheetOfMonth(gardenId, date, garden.maxClass)
      console.timeEnd(`generateTimesheetOfMonth: gardenId=${gardenId}, date=${date}`)
    }

    let fromDate: Date, toDate: Date
    if (type === TimesheetType.MONTH) {
      fromDate = dateMoment.clone().startOf('month').toDate()
      toDate = dateMoment.clone().endOf('month').toDate()
    } else if (type === TimesheetType.WEEK) {
      fromDate = dateMoment.clone().startOf('isoWeek').toDate()
      toDate = dateMoment.clone().endOf('isoWeek').toDate()
    }

    const timesheets = await this.gardenTimesheetRepository.findMany({
      projection: VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
      options: { lean: true },
      conditions: {
        gardenId: new Types.ObjectId(gardenId),
        date: {
          $gte: fromDate,
          $lte: toDate
        },
        $or: [
          {
            status: GardenTimesheetStatus.INACTIVE
          },
          {
            'slots.status': SlotStatus.NOT_AVAILABLE
          }
        ]
      }
    })
    return this.transformDataToCalendar(timesheets)
  }

  public async viewAllGardenTimesheetList(
    queryAllGardenTimesheetDto: QueryAllGardenTimesheetDto
  ): Promise<GardenTimesheetDocument[]> {
    const { type, date } = queryAllGardenTimesheetDto
    this.appLogger.log(`viewAllGardenTimesheetList: type=${type}, date=${date}`)

    const dateMoment = moment(date).tz(VN_TIMEZONE)
    let fromDate: Date, toDate: Date
    if (type === TimesheetType.MONTH) {
      fromDate = dateMoment.clone().startOf('month').toDate()
      toDate = dateMoment.clone().endOf('month').toDate()
    } else if (type === TimesheetType.WEEK) {
      fromDate = dateMoment.clone().startOf('isoWeek').toDate()
      toDate = dateMoment.clone().endOf('isoWeek').toDate()
    }

    const timesheets = await this.gardenTimesheetRepository.findMany({
      projection: VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
      options: { lean: true },
      conditions: {
        date: {
          $gte: fromDate,
          $lte: toDate
        },
        $or: [
          {
            status: GardenTimesheetStatus.INACTIVE
          },
          {
            'slots.status': SlotStatus.NOT_AVAILABLE
          }
        ]
      }
    })
    return this.transformDataToCalendar(timesheets)
  }

  public async viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse> {
    const { startDate, duration, weekdays } = queryAvailableTimeDto
    const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = startOfDate.clone().add(duration, 'week').endOf('date')
    this.appLogger.log(`viewAvailableTime: startOfDate=${startOfDate.toDate()}, duration=${duration}, endOfDate=${endOfDate.toDate()}, weekdays=${weekdays}`)
    
    const searchDates = []
    let currentDate = startOfDate.clone()
    while (currentDate.isSameOrBefore(endOfDate)) {
      for (let weekday of weekdays) {
        const searchDate = currentDate.isoWeekday(weekday)
        if (searchDate.isSameOrAfter(startOfDate) && searchDate.isSameOrBefore(endOfDate)) {
          searchDates.push(searchDate.toDate())
        }
      }
      currentDate.add(1, 'week')
    }

    const dateTimesheets = await this.gardenTimesheetRepository.model.aggregate([
      {
        $match: {
          date: {
            $in: searchDates
          },
          status: GardenTimesheetStatus.ACTIVE
        }
      },
      {
        $group: {
          _id: '$date',
          timesheets: {
            $push: '$$ROOT'
          }
        }
      }
    ])

    this.appLogger.debug(`dateTimesheets.length=${dateTimesheets.length}`)
    this.appLogger.debug(`totalNumberOfDays=${duration * weekdays.length}`)
    if (dateTimesheets.length < duration * weekdays.length) return { slotNumbers: [] }

    let availableTimeOfDates = []
    let availableTime = SLOT_NUMBERS
    for (const dateTimesheet of dateTimesheets) {
      let availableSlots = []
      for (const gardenTimesheet of dateTimesheet.timesheets as GardenTimesheet[]) {
        const slots = gardenTimesheet.slots as Slot[]
        if (slots?.length === 0) {
          availableSlots = SLOT_NUMBERS
          break
        } else {
          const groupSlots = _.groupBy(slots, 'slotNumber')
          SLOT_NUMBERS.forEach((slot) => {
            if (!_.get(groupSlots, slot) || _.get(groupSlots, slot)?.length < gardenTimesheet.gardenMaxClass) {
              availableSlots.push(slot)
            }
          })
        }
      }
      availableTimeOfDates.push({ availableSlots, date: dateTimesheet._id })
      availableTime = _.intersection(availableTime, availableSlots)
    }

    this.appLogger.log(`availableTimeOfDates=${JSON.stringify(availableTimeOfDates)}`)
    return { slotNumbers: availableTime }
  }

  private async generateTimesheetOfMonth(gardenId: string, date: Date, gardenMaxClass: number) {
    const startOfMonth = moment(date).tz(VN_TIMEZONE).startOf('month')
    const endOfMonth = moment(date).tz(VN_TIMEZONE).endOf('month')
    const monthTimesheet = []
    let currentDate = startOfMonth.clone()
    while (currentDate.isSameOrBefore(endOfMonth)) {
      const gardenTimesheet = new CreateGardenTimesheetDto(
        new Types.ObjectId(gardenId),
        currentDate.toDate(),
        gardenMaxClass
      )
      monthTimesheet.push(gardenTimesheet)
      currentDate.add(1, 'day')
    }
    await this.gardenTimesheetRepository.model.insertMany(monthTimesheet)
  }

  private transformDataToCalendar(timesheets: GardenTimesheetDocument[]) {
    const calendars = []
    for (const timesheet of timesheets) {
      if (timesheet.status === GardenTimesheetStatus.INACTIVE) {
        const startOfDate = moment(timesheet.date).tz(VN_TIMEZONE).startOf('date')
        const endOfDate = moment(timesheet.date).tz(VN_TIMEZONE).endOf('date')
        _.set(timesheet, 'start', startOfDate)
        _.set(timesheet, 'end', endOfDate)
        _.unset(timesheet, 'date')
        _.unset(timesheet, 'slots')
        calendars.push(timesheet)
      } else {
        for (const slot of timesheet.slots) {
          if (slot.status === SlotStatus.NOT_AVAILABLE) {
            _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass)
            calendars.push(slot)
          }
        }
      }
    }
    return calendars
  }
}
