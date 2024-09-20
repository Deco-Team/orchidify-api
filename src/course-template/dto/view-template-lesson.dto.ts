import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLessonDto } from '@course/dto/lesson.dto'

class ViewTemplateLessonDetailResponse extends BaseLessonDto {}
export class ViewTemplateLessonDetailDataResponse extends DataResponse(ViewTemplateLessonDetailResponse) {}
