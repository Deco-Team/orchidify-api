import { Injectable, Inject } from '@nestjs/common'
import * as moment from 'moment-timezone'
import * as _ from 'lodash'
import { IGardenTimesheetRepository } from '@garden-timesheet/repositories/garden-timesheet.repository'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto'
import {
  GardenStatus,
  GardenTimesheetStatus,
  SLOT_NUMBERS,
  SlotNumber,
  SlotStatus,
  TimesheetType
} from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { CreateGardenTimesheetDto } from '@garden-timesheet/dto/create-garden-timesheet.dto'
import { AppLogger } from '@src/common/services/app-logger.service'
import { VIEW_GARDEN_TIMESHEET_LIST_PROJECTION } from '@garden-timesheet/contracts/constant'
import { QueryAllGardenTimesheetDto } from '@garden-timesheet/dto/view-all-garden-timesheet.dto'
import { QueryAvailableTimeDto, ViewAvailableTimeResponse } from '@garden-timesheet/dto/view-available-timesheet.dto'
import { Slot } from '@garden-timesheet/schemas/slot.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { IGardenRepository } from '@garden/repositories/garden.repository'

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
    private readonly gardenTimesheetRepository: IGardenTimesheetRepository,
    @Inject(IGardenRepository)
    private readonly gardenRepository: IGardenRepository
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
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewAllGardenTimesheetList: type=${type}, date=${date}`)

    await this.generateAllTimesheetOfMonth(dateMoment.toDate())

    let fromDate: Date, toDate: Date
    // if (type === TimesheetType.MONTH) {
    //   fromDate = dateMoment.clone().startOf('month').toDate()
    //   toDate = dateMoment.clone().endOf('month').toDate()
    // } else if (type === TimesheetType.WEEK) {
    //   fromDate = dateMoment.clone().startOf('isoWeek').toDate()
    //   toDate = dateMoment.clone().endOf('isoWeek').toDate()
    // }
    fromDate = dateMoment.clone().startOf('isoWeek').toDate()
    toDate = dateMoment.clone().endOf('isoWeek').toDate()

    const dateTimesheets = await this.gardenTimesheetRepository.model.aggregate([
      {
        $match: {
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

    // let unavailableTimeOfDates = []
    // let unavailableTime = SLOT_NUMBERS
    // for (const dateTimesheet of dateTimesheets) {
    //   const groupTimesheets = _.groupBy(dateTimesheet.timesheets, 'status')
    //   const activeGroupTimesheets = _.get(groupTimesheets, GardenTimesheetStatus.ACTIVE)
    //   if (!activeGroupTimesheets || activeGroupTimesheets?.length === 0) {
    //     unavailableTimeOfDates.push({ date: dateTimesheet._id })
    //     continue
    //   }

    //   for (const gardenTimesheet of activeGroupTimesheets as GardenTimesheet[]) {
    //     let unavailableSlots = []
    //     const groupSlots = _.groupBy(gardenTimesheet.slots, 'slotNumber')
    //     SLOT_NUMBERS.forEach((slotNumber) => {
    //       if (
    //         _.get(groupSlots, slotNumber) &&
    //         _.get(groupSlots, slotNumber)?.length === gardenTimesheet.gardenMaxClass
    //       ) {
    //         unavailableSlots.push(slotNumber)
    //       }
    //     })
    //     unavailableTimeOfDates.push({ unavailableSlots, date: dateTimesheet._id })
    //     unavailableTime = _.intersection(unavailableTime, unavailableSlots)
    //   }
    // }

    // this.appLogger.log(`unavailableTimeOfDates=${JSON.stringify(unavailableTimeOfDates)}`)
    // this.appLogger.log(`unavailableTime=${unavailableTime}`)

    // return dateTimesheets
    return this.transformDataToCalendar(dateTimesheets)
  }

  public async viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse> {
    const { startDate, duration, weekdays } = queryAvailableTimeDto
    const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = startOfDate.clone().add(duration, 'week').endOf('date')
    this.appLogger.log(
      `viewAvailableTime: startOfDate=${startOfDate.toISOString()}, duration=${duration}, endOfDate=${endOfDate.toISOString()}, weekdays=${weekdays}`
    )

    await this.generateAllTimesheetFromDateRange(startOfDate, endOfDate)

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

    const groupGardenTimesheets = await this.gardenTimesheetRepository.model.aggregate([
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
          _id: '$gardenId',
          timesheets: {
            $push: '$$ROOT'
          },
          count: { $sum: 1 }
        }
      }
    ])

    this.appLogger.debug(`groupGardenTimesheets.length=${groupGardenTimesheets.length}`)
    this.appLogger.debug(`totalNumberOfDays=${duration * weekdays.length}`)
    this.appLogger.debug(`searchDates.length=${searchDates.length}`)
    const availableGroupGardenTimesheets = groupGardenTimesheets.filter(
      (groupGardenTimesheet) => groupGardenTimesheet.count === searchDates.length
    )
    if (availableGroupGardenTimesheets.length === 0) return { slotNumbers: [] }
    this.appLogger.debug(`availableGroupGardenTimesheets.length=${availableGroupGardenTimesheets.length}`)

    let availableTimeOfDates = []
    let availableTime = SLOT_NUMBERS
    for (const availableGroupGardenTimesheet of availableGroupGardenTimesheets) {
      let availableGardenSlots = SLOT_NUMBERS
      for (const gardenTimesheet of availableGroupGardenTimesheet.timesheets as GardenTimesheet[]) {
        const slots = gardenTimesheet.slots as Slot[]
        if (slots?.length !== 0) {
          const groupSlots = _.groupBy(slots, 'slotNumber')
          const tempAvailableGardenSlots = []
          SLOT_NUMBERS.forEach((slotNumber) => {
            if (
              !_.get(groupSlots, slotNumber) ||
              _.get(groupSlots, slotNumber)?.length < gardenTimesheet.gardenMaxClass
            ) {
              tempAvailableGardenSlots.push(slotNumber)
            }
          })
          availableGardenSlots = _.intersection(tempAvailableGardenSlots, availableGardenSlots)
        }
      }
      availableTimeOfDates.push({ availableGardenSlots, gardenId: availableGroupGardenTimesheet._id })
      availableTime = _.union(availableTime, availableGardenSlots)
    }

    this.appLogger.log(`availableTimeOfDates=${JSON.stringify(availableTimeOfDates)}`)
    this.appLogger.log(`availableTime=${availableTime}`)
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

  private async generateAllTimesheetOfMonth(date: Date) {
    this.appLogger.log(`generateAllTimesheetOfMonth: ${date.toISOString()}`)
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    const gardens = await this.gardenRepository.findMany({
      conditions: { status: GardenStatus.ACTIVE }
    })
    const gardenIds = gardens.map((garden) => garden._id)
    // check month garden timesheet of gardens have been generated
    const existedGardenTimesheets = await this.gardenTimesheetRepository.findMany({
      conditions: {
        date: dateMoment.clone().startOf('month'),
        gardenId: {
          $in: gardenIds
        }
      }
    })
    this.appLogger.log(`existedGardenTimesheets.length: ${existedGardenTimesheets.length}`)
    this.appLogger.log(`gardenIds.length: ${gardenIds.length}`)
    if (existedGardenTimesheets.length < gardenIds.length) {
      console.time(`generateAllTimesheetOfMonth: date=${date.toISOString()}`)
      const generateTimesheetPromises = []
      const existedGardenTimesheetGardenIds = existedGardenTimesheets.map((gardenTimesheet) =>
        gardenTimesheet.gardenId.toString()
      )
      gardens
        .filter((garden) => existedGardenTimesheetGardenIds.includes(garden._id.toString()) === false)
        .forEach((garden) => {
          generateTimesheetPromises.push(this.generateTimesheetOfMonth(garden._id, date, garden.maxClass))
        })
      await Promise.all(generateTimesheetPromises)
      console.timeEnd(`generateAllTimesheetOfMonth: date=${date.toISOString()}`)
    }
  }

  private async generateAllTimesheetFromDateRange(startOfDate: moment.Moment, endOfDate: moment.Moment) {
    const generateAllTimesheetPromises = []
    let currentDate = startOfDate.clone().startOf('month')
    while (currentDate.isSameOrBefore(endOfDate)) {
      generateAllTimesheetPromises.push(this.generateAllTimesheetOfMonth(currentDate.clone().toDate()))
      currentDate.add(1, 'month')
    }
    await Promise.all(generateAllTimesheetPromises)
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
