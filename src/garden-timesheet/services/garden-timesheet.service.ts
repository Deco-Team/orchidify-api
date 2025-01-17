import { Injectable, Inject, forwardRef } from '@nestjs/common'
import * as moment from 'moment-timezone'
import * as _ from 'lodash'
import { IGardenTimesheetRepository } from '@garden-timesheet/repositories/garden-timesheet.repository'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { FilterQuery, MongooseQueryOptions, PopulateOptions, QueryOptions, Types, UpdateQuery } from 'mongoose'
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto'
import {
  AttendanceStatus,
  GardenStatus,
  GardenTimesheetStatus,
  SLOT_NUMBERS,
  SlotNumber,
  SlotStatus,
  TimesheetType,
  Weekday
} from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { CreateGardenTimesheetDto } from '@garden-timesheet/dto/create-garden-timesheet.dto'
import { AppLogger } from '@src/common/services/app-logger.service'
import {
  SLOT_CLASS_DETAIL_PROJECTION,
  VIEW_GARDEN_TIMESHEET_LIST_PROJECTION
} from '@garden-timesheet/contracts/constant'
import { QueryTeachingTimesheetDto } from '@garden-timesheet/dto/view-teaching-timesheet.dto'
import { QueryAvailableTimeDto, ViewAvailableTimeResponse } from '@garden-timesheet/dto/view-available-timesheet.dto'
import { Slot } from '@garden-timesheet/schemas/slot.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { IGardenRepository } from '@garden/repositories/garden.repository'
import { BaseSlotMetadataDto, CreateSlotDto } from '@garden-timesheet/dto/slot.dto'
import { HelperService } from '@common/services/helper.service'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { Course } from '@course/schemas/course.schema'
import { IClassService } from '@class/services/class.service'
import { QueryMyTimesheetDto } from '@garden-timesheet/dto/view-my-timesheet.dto'
import { ILearnerClassService } from '@class/services/learner-class.service'
import {
  QuerySlotByGardenIdsDto,
  QueryInactiveTimesheetByGardenDto
} from '@garden-timesheet/dto/garden-manager-view-timesheet.dto'

export const IGardenTimesheetService = Symbol('IGardenTimesheetService')

export interface IGardenTimesheetService {
  findById(
    gardenTimesheetId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<GardenTimesheetDocument>
  findOneBy(
    conditions: FilterQuery<GardenTimesheet>,
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
  viewTeachingTimesheet(queryTeachingTimesheetDto: QueryTeachingTimesheetDto): Promise<GardenTimesheetDocument[]>
  viewMyTimesheet(queryMyTimesheetDto: QueryMyTimesheetDto): Promise<GardenTimesheetDocument[]>
  viewSlotsByGardenIds(querySlotByGardenIdsDto: QuerySlotByGardenIdsDto): Promise<GardenTimesheetDocument[]>
  viewInactiveTimesheetByGarden(
    queryInactiveTimesheetByGardenDto: QueryInactiveTimesheetByGardenDto
  ): Promise<GardenTimesheetDocument[]>
  viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse>
  generateSlotsForClass(
    params: {
      startDate: Date
      duration: number
      weekdays: Weekday[]
      slotNumbers: SlotNumber[]
      gardenId: Types.ObjectId
      instructorId: Types.ObjectId
      classId: Types.ObjectId
      metadata: BaseSlotMetadataDto
      courseData: Course
    },
    options?: QueryOptions | undefined
  ): Promise<boolean>
  findSlotBy(params: { slotId: string; instructorId?: string; gardenIds?: string[] }): Promise<Slot>
  findMany(
    conditions: FilterQuery<GardenTimesheetDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<GardenTimesheetDocument[]>
  updateMany(
    conditions: FilterQuery<GardenTimesheetDocument>,
    payload: UpdateQuery<GardenTimesheetDocument>,
    options?: import('mongodb').UpdateOptions | null
  ): Promise<void>
}

@Injectable()
export class GardenTimesheetService implements IGardenTimesheetService {
  private readonly appLogger = new AppLogger(GardenTimesheetService.name)
  constructor(
    @Inject(IGardenTimesheetRepository)
    private readonly gardenTimesheetRepository: IGardenTimesheetRepository,
    @Inject(IGardenRepository)
    private readonly gardenRepository: IGardenRepository,
    private readonly helperService: HelperService,
    @Inject(forwardRef(() => IClassService))
    private readonly classService: IClassService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
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

  public async findOneBy(
    conditions: FilterQuery<GardenTimesheet>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
      conditions,
      projection,
      populates
    })
    return gardenTimesheet
  }

  public async findSlotBy(params: { slotId: string; instructorId?: string; gardenIds?: string[] }) {
    const { slotId, instructorId, gardenIds } = params
    const conditions = { 'slots._id': new Types.ObjectId(slotId) }
    if (instructorId) conditions['slots.instructorId'] = new Types.ObjectId(instructorId)

    const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
      conditions,
      options: { lean: true }
    })
    if (!gardenTimesheet) return null
    if (gardenIds && gardenIds.length > 0 && !gardenIds.includes(gardenTimesheet.gardenId.toString())) return null

    const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId)
    const [garden, courseClass] = await Promise.all([
      this.gardenRepository.findOne({
        conditions: {
          _id: gardenTimesheet.gardenId
        },
        projection: ['name']
      }),
      this.classService.findById(slot.classId.toString(), SLOT_CLASS_DETAIL_PROJECTION, [
        { path: 'course', select: ['code'] }
      ])
    ])

    return {
      createdAt: gardenTimesheet['createdAt'],
      updatedAt: gardenTimesheet['updatedAt'],
      ...slot,
      garden,
      class: courseClass
    }
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
    } else if (type === TimesheetType.DAY) {
      fromDate = dateMoment.clone().startOf('date').toDate()
      toDate = dateMoment.clone().endOf('date').toDate()
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

  public async viewTeachingTimesheet(
    queryTeachingTimesheetDto: QueryTeachingTimesheetDto
  ): Promise<GardenTimesheetDocument[]> {
    const { type, instructorId, date } = queryTeachingTimesheetDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewTeachingTimesheet: type=${type}, instructorId=${instructorId}, date=${date}`)

    let fromDate: Date, toDate: Date
    if (type === TimesheetType.MONTH) {
      fromDate = dateMoment.clone().startOf('month').toDate()
      toDate = dateMoment.clone().endOf('month').toDate()
    } else if (type === TimesheetType.WEEK) {
      fromDate = dateMoment.clone().startOf('isoWeek').toDate()
      toDate = dateMoment.clone().endOf('isoWeek').toDate()
    } else if (type === TimesheetType.DAY) {
      fromDate = dateMoment.clone().startOf('date').toDate()
      toDate = dateMoment.clone().endOf('date').toDate()
    }

    const timesheets = await this.gardenTimesheetRepository.findMany({
      projection: VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
      options: { lean: true },
      conditions: {
        date: {
          $gte: fromDate,
          $lte: toDate
        },
        'slots.instructorId': new Types.ObjectId(instructorId)
      },
      populates: [
        {
          path: 'garden',
          select: ['name']
        }
      ]
    })
    return this.transformDataToTeachingCalendar(timesheets, instructorId)
  }

  public async viewSlotsByGardenIds(
    querySlotByGardenIdsDto: QuerySlotByGardenIdsDto
  ): Promise<GardenTimesheetDocument[]> {
    const { type, gardenIds, date } = querySlotByGardenIdsDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewTimesheetByGardenIds: type=${type}, gardenIds=${gardenIds}, date=${date}`)

    let fromDate: Date, toDate: Date
    if (type === TimesheetType.DAY) {
      fromDate = dateMoment.clone().startOf('date').toDate()
      toDate = dateMoment.clone().endOf('date').toDate()
    }

    const timesheets = await this.gardenTimesheetRepository.findMany({
      projection: VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
      options: { lean: true },
      conditions: {
        date: {
          $gte: fromDate,
          $lte: toDate
        },
        gardenId: {
          $in: gardenIds.map((id) => new Types.ObjectId(id))
        },
        'slots.status': SlotStatus.NOT_AVAILABLE
      },
      populates: [
        {
          path: 'garden',
          select: ['name']
        },
        {
          path: 'slots.instructor',
          select: ['name']
        }
      ]
    })
    return this.transformDataToGardenIdsCalendar(timesheets)
  }

  public async viewMyTimesheet(queryMyTimesheetDto: QueryMyTimesheetDto): Promise<GardenTimesheetDocument[]> {
    const { type, learnerId, date } = queryMyTimesheetDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewMyTimesheet: type=${type}, learnerId=${learnerId}, date=${date}`)

    let fromDate: Date, toDate: Date
    if (type === TimesheetType.MONTH) {
      fromDate = dateMoment.clone().startOf('month').toDate()
      toDate = dateMoment.clone().endOf('month').toDate()
    } else if (type === TimesheetType.WEEK) {
      fromDate = dateMoment.clone().startOf('isoWeek').toDate()
      toDate = dateMoment.clone().endOf('isoWeek').toDate()
    }

    // get classes that learner had enrolled
    const learnerClasses = await this.learnerClassService.findMany({
      learnerId: new Types.ObjectId(learnerId)
    })
    const classIds = learnerClasses.map((learnerClass) => learnerClass.classId)

    const timesheets = await this.gardenTimesheetRepository.findMany({
      projection: VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
      options: { lean: true },
      conditions: {
        date: {
          $gte: fromDate,
          $lte: toDate
        },
        'slots.classId': {
          $in: classIds
        }
      },
      populates: [
        {
          path: 'garden',
          select: ['name']
        },
        {
          path: 'slots.instructor',
          select: ['name']
        },
        {
          path: 'slots.attendance',
          select: ['status'],
          match: {
            learnerId: new Types.ObjectId(learnerId)
          }
        }
      ]
    })
    return this.transformDataToMyCalendar(
      timesheets,
      classIds.map((classId) => classId.toString())
    )
  }

  public async viewInactiveTimesheetByGarden(queryInactiveTimesheetByGardenDto: QueryInactiveTimesheetByGardenDto) {
    const { gardenId, date } = queryInactiveTimesheetByGardenDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log(`viewGardenTimesheetList: gardenId=${gardenId}, date=${date}`)

    let fromDate: Date, toDate: Date
    const type = TimesheetType.MONTH
    if (type === TimesheetType.MONTH) {
      fromDate = dateMoment.clone().toDate()
      toDate = dateMoment.clone().add(1, 'month').toDate()
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
          }
        ]
      }
    })
    return this.transformDataToCalendar(timesheets)
  }

  public async viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse> {
    const { startDate, duration, weekdays, instructorId } = queryAvailableTimeDto

    const isValidWeekdays = this.helperService.validateWeekdays(weekdays)
    if (!isValidWeekdays) throw new AppException(Errors.WEEKDAYS_OF_CLASS_INVALID)

    const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date')
    this.appLogger.log(
      `viewAvailableTime: startOfDate=${startOfDate.toISOString()}, duration=${duration}, endOfDate=${endOfDate.toISOString()}, weekdays=${weekdays}`
    )

    await this.generateAllTimesheetFromDateRange(startOfDate, endOfDate)

    const searchDates = []
    let currentDate = startOfDate.clone()
    while (currentDate.isSameOrBefore(endOfDate)) {
      for (let weekday of weekdays) {
        const searchDate = currentDate.clone().isoWeekday(weekday)
        if (searchDate.isSameOrAfter(startOfDate) && searchDate.isBefore(endOfDate)) {
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
        $lookup: {
          from: 'gardens',
          localField: 'gardenId',
          foreignField: '_id',
          as: 'gardens',
          pipeline: [
            {
              $match: {
                status: GardenStatus.ACTIVE
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          gardens: {
            $exists: true,
            $ne: []
          }
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

    const availableGroupGardenTimesheets = []
    const unavailableGroupGardenTimesheets = []
    groupGardenTimesheets.forEach((groupGardenTimesheet) => {
      if (groupGardenTimesheet.count === searchDates.length) {
        availableGroupGardenTimesheets.push(groupGardenTimesheet)
      } else {
        unavailableGroupGardenTimesheets.push(groupGardenTimesheet)
      }
    })

    if (availableGroupGardenTimesheets.length === 0) return { slotNumbers: [] }
    this.appLogger.debug(`availableGroupGardenTimesheets.length=${availableGroupGardenTimesheets.length}`)

    let availableTimeOfGardens = []
    let availableTime = []
    let notAvailableSlots = new Set()

    for (const unavailableGroupGardenTimesheet of unavailableGroupGardenTimesheets) {
      for (const gardenTimesheet of unavailableGroupGardenTimesheet.timesheets as GardenTimesheet[]) {
        const slots = gardenTimesheet.slots as Slot[]
        if (slots?.length !== 0) {
          const groupSlots = _.groupBy(slots, 'slotNumber')
          SLOT_NUMBERS.forEach((slotNumber) => {
            const groupSlot = _.get(groupSlots, slotNumber)
            const isSlotBusyByInstructor =
              groupSlot &&
              groupSlot?.length > 0 &&
              groupSlot.find((slot) => slot.instructorId?.toString() === instructorId?.toString()) !== undefined

            if (isSlotBusyByInstructor) {
              notAvailableSlots.add(slotNumber)
            }
          })
        }
      }
    }

    for (const availableGroupGardenTimesheet of availableGroupGardenTimesheets) {
      let availableGardenSlots = SLOT_NUMBERS
      for (const gardenTimesheet of availableGroupGardenTimesheet.timesheets as GardenTimesheet[]) {
        const slots = gardenTimesheet.slots as Slot[]
        if (slots?.length !== 0) {
          const groupSlots = _.groupBy(slots, 'slotNumber')
          const tempAvailableGardenSlots = []
          SLOT_NUMBERS.forEach((slotNumber) => {
            const groupSlot = _.get(groupSlots, slotNumber)
            const isSlotBusyByInstructor =
              groupSlot &&
              groupSlot?.length > 0 &&
              groupSlot.find((slot) => slot.instructorId?.toString() === instructorId?.toString()) !== undefined
            if (isSlotBusyByInstructor) {
              notAvailableSlots.add(slotNumber)
            }

            if (!groupSlot || groupSlot?.length < gardenTimesheet.gardenMaxClass || !isSlotBusyByInstructor) {
              tempAvailableGardenSlots.push(slotNumber)
            }
          })
          availableGardenSlots = _.intersection(tempAvailableGardenSlots, availableGardenSlots)
        }
      }
      availableTimeOfGardens.push({ slotNumbers: availableGardenSlots, gardenId: availableGroupGardenTimesheet._id })
      availableTime = [...new Set([...availableTime, ...availableGardenSlots])]
    }

    const notAvailableSlotsByInstructor = [...notAvailableSlots] as SlotNumber[]
    availableTime = availableTime.filter((slotNumber) => [...notAvailableSlots].includes(slotNumber) === false)

    this.appLogger.log(`notAvailableSlotsByInstructor=${notAvailableSlotsByInstructor}`)
    this.appLogger.log(`availableTimeOfDates=${JSON.stringify(availableTimeOfGardens)}`)
    this.appLogger.log(`availableTime=${availableTime}`)

    return { slotNumbers: availableTime, availableTimeOfGardens, notAvailableSlotsByInstructor }
  }

  async generateSlotsForClass(
    params: {
      startDate: Date
      duration: number
      weekdays: Weekday[]
      slotNumbers: SlotNumber[]
      gardenId: Types.ObjectId
      instructorId: Types.ObjectId
      classId: Types.ObjectId
      metadata: BaseSlotMetadataDto
      courseData: Course
    },
    options?: QueryOptions | undefined
  ): Promise<boolean> {
    const { startDate, duration, weekdays, slotNumbers, gardenId, instructorId, classId, metadata, courseData } = params
    this.appLogger.debug(
      `generateSlotsForClass: startDate=${startDate}, duration=${duration}, weekdays=${weekdays}, slotNumbers=${slotNumbers}, gardenId=${gardenId}, instructorId=${instructorId}, classId=${classId}`
    )

    const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
    const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date')

    const classDates = []
    let currentDate = startOfDate.clone()
    while (currentDate.isSameOrBefore(endOfDate)) {
      for (let weekday of weekdays) {
        const classDate = currentDate.clone().isoWeekday(weekday)
        if (classDate.isSameOrAfter(startOfDate) && classDate.isBefore(endOfDate)) {
          classDates.push(classDate.toDate())
        }
      }
      currentDate.add(1, 'week')
    }

    const gardenTimesheets = await this.gardenTimesheetRepository.findMany({
      conditions: {
        date: { $in: classDates },
        status: GardenTimesheetStatus.ACTIVE,
        gardenId
      },
      sort: { date: 1 }
    })
    this.appLogger.debug(`generateSlotsForClass: totalNumberOfDays=${duration * weekdays.length}`)
    this.appLogger.debug(`generateSlotsForClass: classDates.length=${classDates.length}`)
    this.appLogger.debug(`generateSlotsForClass: gardenTimesheets.length=${gardenTimesheets.length}`)
    const updateGardenTimesheetPromises = []

    gardenTimesheets.forEach((gardenTimesheet, index) => {
      const session = courseData.sessions[index]
      const newSlots = slotNumbers.map(
        (slotNumber) =>
          new CreateSlotDto(slotNumber, gardenTimesheet.date, instructorId, new Types.ObjectId(session._id), classId, {
            ...metadata,
            sessionNumber: session?.sessionNumber,
            sessionTitle: session?.title
          })
      )
      const totalSlots = [...gardenTimesheet.slots, ...newSlots].sort((a, b) => a.slotNumber - b.slotNumber)
      updateGardenTimesheetPromises.push(
        this.update(
          { _id: gardenTimesheet._id },
          {
            slots: totalSlots
          },
          options
        )
      )
    })
    await Promise.all(updateGardenTimesheetPromises)
    return true
  }

  public async findMany(
    conditions: FilterQuery<GardenTimesheetDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const gardenTimesheets = await this.gardenTimesheetRepository.findMany({
      conditions,
      projection,
      populates
    })
    return gardenTimesheets
  }

  public async updateMany(
    conditions: FilterQuery<GardenTimesheetDocument>,
    payload: UpdateQuery<GardenTimesheetDocument>,
    options?: import('mongodb').UpdateOptions | null
  ) {
    await this.gardenTimesheetRepository.updateMany(conditions, payload, options)
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

  private transformDataToTeachingCalendar(timesheets: GardenTimesheetDocument[], instructorId: string) {
    const calendars = []
    for (const timesheet of timesheets) {
      for (const slot of timesheet.slots) {
        if (slot.status === SlotStatus.NOT_AVAILABLE && slot.instructorId.toString() === instructorId) {
          _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass)
          _.set(slot, 'garden', timesheet['garden'])
          calendars.push(slot)
        }
      }
    }
    return calendars
  }

  private transformDataToMyCalendar(timesheets: GardenTimesheetDocument[], classIds: string[]) {
    const calendars = []
    for (const timesheet of timesheets) {
      for (const slot of timesheet.slots) {
        if (slot.status === SlotStatus.NOT_AVAILABLE && classIds.includes(slot.classId.toString())) {
          _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass)
          _.set(slot, 'garden', timesheet['garden'])
          if (_.get(slot, 'attendance') === null) {
            _.set(slot, 'attendance', {
              status: AttendanceStatus.NOT_YET
            })
          }
          calendars.push(slot)
        }
      }
    }
    return calendars
  }

  private transformDataToGardenIdsCalendar(timesheets: GardenTimesheetDocument[]) {
    const calendars = []
    for (const timesheet of timesheets) {
      for (const slot of timesheet.slots) {
        if (slot.status === SlotStatus.NOT_AVAILABLE) {
          _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass)
          _.set(slot, 'garden', timesheet['garden'])
          calendars.push(slot)
        }
      }
    }
    return calendars
  }
}
