import { Injectable, Inject } from '@nestjs/common'
import * as moment from 'moment-timezone'
import { IGardenTimesheetRepository } from '@garden-timesheet/repositories/garden-timesheet.repository'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto'
import { TimesheetType } from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { CreateGardenTimesheetDto } from '@garden-timesheet/dto/create-garden-timesheet.dto'
import { AppLogger } from '@src/common/services/app-logger.service'

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
  viewTimesheetList(queryGardenTimesheetDto: QueryGardenTimesheetDto): Promise<GardenTimesheetDocument[]>
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

  public async viewTimesheetList(queryGardenTimesheetDto: QueryGardenTimesheetDto) {
    const { type, gardenId, date } = queryGardenTimesheetDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)
    this.appLogger.log('viewTimesheetList: ', type, gardenId, date)

    // check month garden timesheet has been generated
    const existedGardenTimesheet = await this.gardenTimesheetRepository.findOne({
      conditions: {
        gardenId: new Types.ObjectId(gardenId),
        date: dateMoment.clone().startOf('month')
      }
    })
    if (!existedGardenTimesheet) {
      console.time(`generateTimesheetOfMonth: gardenId=${gardenId}, date=${date}`)
      await this.generateTimesheetOfMonth(gardenId, date)
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
    this.appLogger.log('gardenTimesheetRepository.findMany', fromDate, toDate, gardenId)

    return await this.gardenTimesheetRepository.findMany({
      conditions: {
        gardenId: new Types.ObjectId(gardenId),
        date: {
          $gte: fromDate,
          $lte: toDate
        }
      }
    })
  }

  private async generateTimesheetOfMonth(gardenId: string, date: Date) {
    const startOfMonth = moment(date).tz(VN_TIMEZONE).startOf('month')
    const endOfMonth = moment(date).tz(VN_TIMEZONE).endOf('month')
    const monthTimesheet = []
    let currentDate = startOfMonth.clone()
    while (currentDate.isSameOrBefore(endOfMonth)) {
      const gardenTimesheet = new CreateGardenTimesheetDto(new Types.ObjectId(gardenId), currentDate.toDate())
      monthTimesheet.push(gardenTimesheet)
      currentDate.add(1, 'day')
    }
    await this.gardenTimesheetRepository.model.insertMany(monthTimesheet)
  }
}
