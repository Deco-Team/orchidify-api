import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLessonDto } from '@course/dto/lesson.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewTemplateLessonDetailResponse extends BaseLessonDto {
  @ApiProperty()
  index: string
}
export class ViewTemplateLessonDetailDataResponse extends DataResponse(ViewTemplateLessonDetailResponse) {}
