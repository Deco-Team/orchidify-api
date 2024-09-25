import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLessonDto } from './lesson.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewLessonDetailResponse extends BaseLessonDto {
  @ApiProperty()
  index: string
}
export class ViewLessonDetailDataResponse extends DataResponse(ViewLessonDetailResponse) {}
