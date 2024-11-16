import { Controller, UseGuards, Inject } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { INotificationService } from '@notification/services/notification.service'

@ApiTags('Notification')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller()
export class NotificationController {
  constructor(
    @Inject(INotificationService)
    private readonly notificationService: INotificationService,
  ) {}

  // @ApiOperation({
  //   summary: `View Notification List`
  // })
  // @ApiOkResponse({ type: NotificationListDataResponse })
  // @ApiErrorResponse([Errors.SLOT_NOT_FOUND])
  // @Get(':slotId([0-9a-f]{24})')
  // async list(@Req() req, @Param('slotId') slotId: string) {
  //   const { _id: instructorId } = _.get(req, 'user')
  // }
}
