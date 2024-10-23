import { Controller, Get, UseGuards, Inject, Query, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import {
  QueryTeachingTimesheetDto,
  ViewTeachingTimesheetListDataResponse
} from '@garden-timesheet/dto/view-teaching-timesheet.dto'
import {
  QueryAvailableTimeDto,
  ViewAvailableTimeDataResponse
} from '@garden-timesheet/dto/view-available-timesheet.dto'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'

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
  @ApiErrorResponse([Errors.WEEKDAYS_OF_CLASS_INVALID])
  @Get('available-time')
  async viewAvailableTime(@Query() queryAvailableTimeDto: QueryAvailableTimeDto) {
    const result = await this.gardenTimesheetService.viewAvailableTime(queryAvailableTimeDto)
    return result
  }

  @ApiOperation({
    summary: `View Teaching Timesheet List`
  })
  @ApiOkResponse({ type: ViewTeachingTimesheetListDataResponse })
  @Get('teaching-timesheet')
  async viewTeachingTimesheet(@Req() req, @Query() queryTeachingTimesheetDto: QueryTeachingTimesheetDto) {
    const { _id } = _.get(req, 'user')
    queryTeachingTimesheetDto.instructorId = _id
    const docs = await this.gardenTimesheetService.viewTeachingTimesheet(queryTeachingTimesheetDto)
    return { docs }
  }
}
