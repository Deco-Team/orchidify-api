import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { ISettingService } from '@setting/services/setting.service'
import { CourseTypesSettingDetailDataResponse } from '@setting/dto/view-setting.dto'

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
    const CourseTypes = [
      {
        groupName: 'Lan rừng',
        groupItems: ['Lan phi điệp', 'Lan hải yến']
      },
      {
        groupName: 'Lan công nghiệp',
        groupItems: ['Dendrobium', 'Cattleya', 'Lan hồ điệp']
      },
      {
        groupName: 'Quá trình',
        groupItems: ['Cây con', 'Cây trưởng thành', 'Ra hoa', 'Hoa tàn']
      },
      {
        groupName: 'Phương pháp',
        groupItems: ['Tạo hình', 'Tách chiết', 'Chiết ghép', 'Cấy mô']
      }
    ]
    return { docs: CourseTypes }
    // const setting = await this.settingService.findById(settingId)
    // if (!setting || setting.enabled === false) throw new AppException(Errors.SETTING_NOT_FOUND)
    // return setting.value
  }
}
