import { Controller, Get, Req, UseGuards, Inject, Put, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IInstructorService } from '@instructor/services/instructor.service'
import {
  InstructorCertificationsDataResponse,
  InstructorProfileDataResponse
} from '@instructor/dto/view-instructor.dto'
import { INSTRUCTOR_PROFILE_PROJECTION } from '@instructor/contracts/constant'
import { UpdateInstructorProfileDto } from '@instructor/dto/update-instructor-profile.dto'

@ApiTags('Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@Roles(UserRole.INSTRUCTOR)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class InstructorController {
  constructor(
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService
  ) {}

  @ApiOperation({
    summary: 'View instructor profile'
  })
  @Get('profile')
  @ApiOkResponse({ type: InstructorProfileDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  async viewProfile(@Req() req) {
    const { _id } = _.get(req, 'user')
    const instructor = await this.instructorService.findById(_id, INSTRUCTOR_PROFILE_PROJECTION)

    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)
    return instructor
  }

  @ApiOperation({
    summary: 'View instructor certifications'
  })
  @Get('certifications')
  @ApiOkResponse({ type: InstructorCertificationsDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  async viewCertifications(@Req() req) {
    const { _id } = _.get(req, 'user')
    const instructor = await this.instructorService.findById(_id, 'certificates')
    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)

    return { docs: _.get(instructor, 'certificates', []) }
  }

  @ApiOperation({
    summary: 'Update instructor profile'
  })
  @Put('profile')
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  async updateProfile(@Req() req, @Body() updateInstructorProfileDto: UpdateInstructorProfileDto) {
    const { _id } = _.get(req, 'user')
    const instructor = await this.instructorService.update({ _id }, updateInstructorProfileDto)

    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)
    return new SuccessResponse(true)
  }
}
