import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import {
  QueryReportByMonthDto,
  QueryReportByWeekDto,
  ReportClassByStatusListDataResponse,
  ReportRevenueByMonthListDataResponse,
  ReportStaffByStatusListDataResponse,
  ReportTotalSummaryListDataResponse,
  ReportTransactionByDateListDataResponse,
  ReportUserByMonthListDataResponse
} from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ClassStatus, StaffStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { ReportTag, ReportType } from '@report/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'
import { ITransactionService } from '@transaction/services/transaction.service'

@ApiTags('Report - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementReportController {
  constructor(
    @Inject(IReportService)
    private readonly reportService: IReportService,
    @Inject(ITransactionService)
    private readonly transactionService: ITransactionService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Report Data Total Summary`
  })
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('total-summary')
  async viewReportTotalSummary() {
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.CourseSum, ReportType.LearnerSum, ReportType.InstructorSum, ReportType.CourseComboSum]
        },
        tag: ReportTag.System
      },
      ['type', 'data']
    )
    return { docs: reports }
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Report User Data By Month`
  })
  @ApiOkResponse({ type: ReportUserByMonthListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('user-by-month')
  async viewReportUserDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.LearnerSumByMonth, ReportType.InstructorSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
    const learnerReport = _.find(reports, { type: ReportType.LearnerSumByMonth })
    const instructorReport = _.find(reports, { type: ReportType.InstructorSumByMonth })

    const docs = []
    if (learnerReport && instructorReport) {
      for (let month = 1; month <= 12; month++) {
        const learner = _.get(learnerReport.data, `${month}`) || { quantity: 0 }
        const instructor = _.get(instructorReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          learner,
          instructor
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Report Class Data By Status`
  })
  @ApiOkResponse({ type: ReportClassByStatusListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('class-by-status')
  async viewReportClassDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.ClassSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: ClassStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Report Data Total Summary`
  })
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get('admin/total-summary')
  async adminViewReportTotalSummary() {
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.CourseSum, ReportType.LearnerSum, ReportType.InstructorSum, ReportType.RevenueSum]
        },
        tag: ReportTag.System
      },
      ['type', 'data']
    )
    return { docs: reports }
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Report Staff Data By Status`
  })
  @ApiOkResponse({ type: ReportStaffByStatusListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get('admin/staff-by-status')
  async adminViewReportStaffDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.StaffSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: StaffStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Report Revenue Data By Month`
  })
  @ApiOkResponse({ type: ReportRevenueByMonthListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get('admin/revenue-by-month')
  async adminViewReportRevenueDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    let [revenueSumByMonth] = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.RevenueSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )

    const docs = []
    if (revenueSumByMonth) {
      for (let month = 1; month <= 12; month++) {
        const revenue = _.get(revenueSumByMonth.data, `${month}`) || { total: 0 }
        docs.push({
          revenue
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Report Transaction Data By Date`
  })
  @ApiOkResponse({ type: ReportTransactionByDateListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get('admin/transaction-by-date')
  async adminViewReportTransactionByDate(@Query() queryReportByWeekDto: QueryReportByWeekDto) {
    const { date } = queryReportByWeekDto
    const dateMoment = moment(date).tz(VN_TIMEZONE)

    let fromDate: Date, toDate: Date
    fromDate = dateMoment.clone().startOf('isoWeek').toDate()
    toDate = dateMoment.clone().endOf('isoWeek').toDate()

    const reports = await this.transactionService.viewReportTransactionByDate({ fromDate, toDate })

    return { docs: reports }
  }
}
