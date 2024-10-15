import { ApiProperty } from '@nestjs/swagger'
import { BaseSettingDto } from './base.setting.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'

class SettingListItemResponse extends BaseSettingDto {}
class SettingListResponse extends PaginateResponse(SettingListItemResponse) {}
export class SettingListDataResponse extends DataResponse(SettingListResponse) {}

class SettingDetailResponse extends BaseSettingDto {}
export class SettingDetailDataResponse extends DataResponse(SettingDetailResponse) {}

class CourseTypeSettingDetailResponse {
  @ApiProperty({ type: String })
  groupName: string

  @ApiProperty({ type: String })
  groupItems: string[]
}

class CourseTypesSettingDetailResponse {
  @ApiProperty({ type: CourseTypeSettingDetailResponse, isArray: true })
  docs: CourseTypeSettingDetailResponse[]
}
export class CourseTypesSettingDetailDataResponse extends DataResponse(CourseTypesSettingDetailResponse) {}
