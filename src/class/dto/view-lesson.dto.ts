import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseSessionDto } from './session.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewSessionDetailResponse extends BaseSessionDto {
  @ApiProperty()
  index: string
}
export class ViewSessionDetailDataResponse extends DataResponse(ViewSessionDetailResponse) {}
