import { Controller, Get, UseGuards, Inject, Param, Req, Post, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IUserDeviceService } from '@notification/services/user-device.service'
import { CreateUserDeviceDto, UserDeviceDetailDataResponse } from '@notification/dto/user-device.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Types } from 'mongoose'

@ApiTags('UserDevice')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('user-devices')
export class UserDeviceController {
  constructor(
    @Inject(IUserDeviceService)
    private readonly userDeviceService: IUserDeviceService
  ) {}

  @ApiOperation({
    summary: `View User Device Detail`
  })
  @ApiOkResponse({ type: UserDeviceDetailDataResponse })
  @ApiErrorResponse([Errors.USER_DEVICE_NOT_FOUND])
  @Get(':fcmToken')
  async get(@Req() req, @Param('fcmToken') fcmToken: string) {
    const { _id, role } = _.get(req, 'user')
    const userDevice = await this.userDeviceService.findByFcmToken(fcmToken)
    if (!userDevice || userDevice.userId.toString() !== _id || userDevice.userRole !== role)
      throw new AppException(Errors.USER_DEVICE_NOT_FOUND)

    return userDevice
  }

  @ApiOperation({
    summary: `Create User Device`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([])
  @Post()
  async create(@Req() req, @Body() createUserDeviceDto: CreateUserDeviceDto) {
    const { _id, role } = _.get(req, 'user')

    createUserDeviceDto.userId = new Types.ObjectId(_id)
    createUserDeviceDto.userRole = role
    await this.userDeviceService.update({ fcmToken: createUserDeviceDto.fcmToken }, createUserDeviceDto, {
      upsert: true
    })
    return new SuccessResponse(true)
  }
}
