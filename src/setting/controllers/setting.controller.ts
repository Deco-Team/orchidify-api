import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { ISettingService } from '@setting/services/setting.service'
import { CourseTypesSettingDetailDataResponse } from '@setting/dto/view-setting.dto'
import { SettingKey } from '@setting/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'

@ApiTags('Setting')
@ApiBadRequestResponse({ type: ErrorResponse })
@Controller()
export class SettingController {
  constructor(
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {}

  // @ApiOperation({
  //   summary: `[${UserRole.STAFF}] View Setting List`
  // })
  // @ApiBearerAuth()
  // @ApiQuery({ type: PaginationQuery })
  // @ApiOkResponse({ type: SettingListDataResponse })
  // @Roles(UserRole.STAFF)
  // @Get()
  // async list(@Pagination() pagination: PaginationParams, @Query() querySettingDto: StaffQuerySettingDto) {
  //   return await this.settingService.list(pagination, querySettingDto)
  // }

  @ApiOperation({
    summary: `View Course Types (Setting Detail)`
  })
  @ApiOkResponse({ type: CourseTypesSettingDetailDataResponse })
  @ApiErrorResponse([Errors.SETTING_NOT_FOUND])
  @Get('course-types')
  async getCourseTypesSetting() {
    const setting = await this.settingService.findByKey(SettingKey.CourseTypes)
    if (!setting || setting.enabled === false) throw new AppException(Errors.SETTING_NOT_FOUND)
    return { docs: setting.value }
  }
}
