import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseLessonDto } from './lesson.dto'

class ViewLessonDetailResponse extends BaseLessonDto {}
export class ViewLessonDetailDataResponse extends DataResponse(ViewLessonDetailResponse) {}
