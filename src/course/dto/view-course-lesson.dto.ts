import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLessonDto } from '@src/class/dto/lesson.dto'
import { ApiProperty } from '@nestjs/swagger'

class ViewCourseLessonDetailResponse extends BaseLessonDto {
  @ApiProperty()
  index: string
}
export class ViewCourseLessonDetailDataResponse extends DataResponse(ViewCourseLessonDetailResponse) {}
