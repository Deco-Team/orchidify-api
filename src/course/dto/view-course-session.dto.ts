import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseSessionDto } from '@class/dto/session.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewCourseSessionDetailResponse extends BaseSessionDto {
  @ApiProperty({ type: Number })
  sessionNumber: number
}
export class ViewCourseSessionDetailDataResponse extends DataResponse(ViewCourseSessionDetailResponse) {}
