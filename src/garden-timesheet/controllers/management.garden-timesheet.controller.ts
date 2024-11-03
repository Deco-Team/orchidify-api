import { Controller, Get, UseGuards, Inject, Query, Req, Put, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { ErrorResponse, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { GardenStatus, GardenTimesheetStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import {
  QueryGardenTimesheetDto,
  ViewGardenTimesheetListDataResponse
} from '@garden-timesheet/dto/view-garden-timesheet.dto'
import { IGardenService } from '@garden/services/garden.service'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import {
  QueryInstructorTimesheetDto,
  ViewTeachingTimesheetListDataResponse
} from '@garden-timesheet/dto/view-teaching-timesheet.dto'
import { UpdateGardenTimesheetDto } from '@garden-timesheet/dto/update-garden-timesheet.dto'
import { Types } from 'mongoose'

@ApiTags('GardenTimesheet - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementGardenTimesheetController {
  constructor(
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService,
    @Inject(IGardenService)
    private readonly gardenService: IGardenService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.STAFF}][${UserRole.GARDEN_MANAGER}] View GardenTimesheet List`
  })
  @ApiOkResponse({ type: ViewGardenTimesheetListDataResponse })
  @ApiErrorResponse([Errors.GARDEN_NOT_FOUND, Errors.GARDEN_INACTIVE])
  @Roles(UserRole.STAFF, UserRole.GARDEN_MANAGER)
  @Get()
  async viewGardenTimesheet(@Req() req, @Query() queryGardenTimesheetDto: QueryGardenTimesheetDto) {
    const { _id, role } = _.get(req, 'user')
    const garden = await this.gardenService.findById(queryGardenTimesheetDto.gardenId)
    if (!garden || (role === UserRole.GARDEN_MANAGER && garden?.gardenManagerId?.toString() !== _id))
      throw new AppException(Errors.GARDEN_NOT_FOUND)
    if (garden.status === GardenStatus.INACTIVE) throw new AppException(Errors.GARDEN_INACTIVE)

    const docs = await this.gardenTimesheetService.viewGardenTimesheetList(queryGardenTimesheetDto, garden)
    return { docs }
  }

  @ApiOperation({
    summary: `View Instructor Timesheet List`
  })
  @ApiOkResponse({ type: ViewTeachingTimesheetListDataResponse })
  @Roles(UserRole.STAFF)
  @Get('instructor-timesheet')
  async viewInstructorTimesheet(@Query() queryTeachingTimesheetDto: QueryInstructorTimesheetDto) {
    const docs = await this.gardenTimesheetService.viewTeachingTimesheet(queryTeachingTimesheetDto)
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.STAFF}] Update Garden Timesheet`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.GARDEN_TIMESHEET_NOT_FOUND, Errors.CAN_NOT_UPDATE_GARDEN_TIMESHEET])
  @Roles(UserRole.STAFF)
  @Put()
  async updateGardenTimesheet(@Body() updateGardenTimesheetDto: UpdateGardenTimesheetDto) {
    const { date, gardenId, status } = updateGardenTimesheetDto

    const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
      date: date,
      gardenId: new Types.ObjectId(gardenId)
    })
    if (!gardenTimesheet) throw new AppException(Errors.GARDEN_TIMESHEET_NOT_FOUND)

    // BR-27: Garden timesheet is not allowed to update the time that there is a course already scheduled.
    if (gardenTimesheet.slots.length > 0 && status === GardenTimesheetStatus.INACTIVE)
      throw new AppException(Errors.CAN_NOT_UPDATE_GARDEN_TIMESHEET)

    await this.gardenTimesheetService.update(
      { _id: gardenTimesheet._id },
      {
        $set: { status }
      }
    )

    return new SuccessResponse(true)
  }
}
