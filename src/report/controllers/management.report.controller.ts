import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import {
  QueryReportClassByMonthDto,
  ReportClassByStatusListDataResponse,
  ReportTotalSummaryListDataResponse,
  ReportUserByMonthListDataResponse
} from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ClassStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { ReportType } from '@report/contracts/constant'

@ApiTags('Report')
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
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('total-summary')
  async viewReportTotalSummary() {
    const reports = await this.reportService.findMany({
      type: {
        $in: [ReportType.CourseSum, ReportType.LearnerSum, ReportType.InstructorSum, ReportType.CourseComboSum]
      }
    })
    return { docs: reports }
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] View Report User Data By Month`
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReportUserByMonthListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('user-by-month')
  async viewReportUserDataByMonth(@Query() queryReportClassByMonthDto: QueryReportClassByMonthDto) {
    const { year = 2024 } = queryReportClassByMonthDto
    const [learnerReport, instructorReport] = await this.reportService.findMany({
      type: {
        $in: [ReportType.LearnerSumByMonth, ReportType.InstructorSumByMonth]
      },
      'data.year': year
    })
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
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReportClassByStatusListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('class-by-status')
  async viewReportClassDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.ClassSum })
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: ClassStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }
}
