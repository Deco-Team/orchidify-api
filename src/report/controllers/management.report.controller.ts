import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import { QueryReportDto, ReportDetailDataResponse, ReportListDataResponse } from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
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
  @ApiOkResponse({ type: ReportListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('total-summary')
  async viewReportTotalSummary() {
    const reports = await this.reportService.findMany({
      type: {
        $in: [
          ReportType.CourseSum,
          ReportType.LearnerSum,
          ReportType.InstructorSum,
          ReportType.CourseComboSum
        ]
      }
    })
    // const a = [
    //   {
    //     learner: {
    //       quantity: 1000
    //     },
    //     instructor: {
    //       quantity: 1000
    //     }
    //   }
    // ]
    // const b = [
    //   {
    //     status: '',
    //     quantity: 1000
    //   }
    // ]
    return { docs: reports }
  }
}
