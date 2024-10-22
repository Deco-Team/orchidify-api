import { Controller, Get, UseGuards, Inject, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IInstructorService } from '@instructor/services/instructor.service'
import { INSTRUCTOR_DETAIL_PROJECTION, VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import {
  InstructorDetailDataResponse,
  ViewerViewInstructorDetailDataResponse} from '@instructor/dto/view-instructor.dto'

@ApiTags('Instructor - Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.LEARNER)
@Controller('learner')
export class LearnerInstructorController {
  constructor(
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService,
  ) {}

  @ApiOperation({
    summary: `View Instructor Detail`
  })
  @ApiOkResponse({ type: ViewerViewInstructorDetailDataResponse })
  @ApiErrorResponse([Errors.INSTRUCTOR_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') instructorId: string) {
    const instructor = await this.instructorService.findById(instructorId, VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION)
    if (!instructor) throw new AppException(Errors.INSTRUCTOR_NOT_FOUND)

    return instructor
  }
}
