import { Controller, Get, UseGuards, Inject, Query, Req, Put } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { GardenStatus, UserRole } from '@common/contracts/constant'
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

  // @ApiOperation({
  //   summary: `[${UserRole.STAFF}][${UserRole.GARDEN_MANAGER}] Update Garden Timesheet`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @ApiErrorResponse([Errors.COURSE_NOT_FOUND])
  // @Roles(UserRole.STAFF, UserRole.GARDEN_MANAGER)
  // @Put(':id([0-9a-f]{24})')
  // async updateGardenTimesheet(@Req() req,) {
  // const { _id } = _.get(req, 'user')
  // const course = await this.gardenTimesheetService.update(
  //   { _id: courseId, status: CourseStatus.DRAFT, instructorId: new Types.ObjectId(_id) },
  //   updateCourseDto
  // )

  // if (!course) throw new AppException(Errors.COURSE_NOT_FOUND)
  // return new SuccessResponse(true)
  // }
}
