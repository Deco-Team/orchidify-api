import { Controller, Get, UseGuards, Inject, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import {
  QueryAllGardenTimesheetDto,
  ViewAllGardenTimesheetListDataResponse
} from '@garden-timesheet/dto/view-all-garden-timesheet.dto'
import {
  QueryAvailableTimeDto,
  ViewAvailableTimeDataResponse
} from '@garden-timesheet/dto/view-available-timesheet.dto'

@ApiTags('GardenTimesheet - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorGardenTimesheetController {
  constructor(
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService
  ) {}

  @ApiOperation({
    summary: `View Available Time (SlotNumbers) of Garden Timesheet`
  })
  @ApiOkResponse({ type: ViewAvailableTimeDataResponse })
  @Get('available-time')
  async viewAvailableTime(@Query() queryAvailableTimeDto: QueryAvailableTimeDto) {
    const result = await this.gardenTimesheetService.viewAvailableTime(queryAvailableTimeDto)
    return result
  }

  @ApiOperation({
    summary: `View All Garden Timesheet List`
  })
  @ApiOkResponse({ type: ViewAllGardenTimesheetListDataResponse })
  @Get()
  async viewAllGardenTimesheet(@Query() queryAllGardenTimesheetDto: QueryAllGardenTimesheetDto) {
    const docs = await this.gardenTimesheetService.viewAllGardenTimesheetList(queryAllGardenTimesheetDto)
    return { docs }
  }
}
