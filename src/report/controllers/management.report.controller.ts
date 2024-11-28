import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import {
  QueryReportByMonthDto,
  ReportClassByStatusListDataResponse,
  ReportTotalSummaryListDataResponse,
  ReportUserByMonthListDataResponse
} from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ClassStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { ReportTag, ReportType } from '@report/contracts/constant'

@ApiTags('Report - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementReportController {
  constructor(
    @Inject(IReportService)
    private readonly reportService: IReportService
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
    const [learnerReport, instructorReport] = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.LearnerSumByMonth, ReportType.InstructorSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
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
}
