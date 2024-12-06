import { Controller, Get, UseGuards, Inject, Query, Req } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { QueryMyTimesheetDto, ViewMyTimesheetListDataResponse } from '@garden-timesheet/dto/view-my-timesheet.dto'

@ApiTags('GardenTimesheet - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learner')
export class LearnerGardenTimesheetController {
  constructor(
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService
  ) {}

  @ApiOperation({
    summary: `View My Timesheet`
  })
  @ApiOkResponse({ type: ViewMyTimesheetListDataResponse })
  @Get('my-timesheet')
  async viewMyTimesheet(@Req() req, @Query() queryMyTimesheetDto: QueryMyTimesheetDto) {
    const { _id: learnerId } = _.get(req, 'user')
    queryMyTimesheetDto.learnerId = learnerId
    const docs = await this.gardenTimesheetService.viewMyTimesheet(queryMyTimesheetDto)
    return { docs }
  }
}
