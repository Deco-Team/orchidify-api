import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseSessionDto } from '@class/dto/session.dto'

class ViewCourseSessionDetailResponse extends BaseSessionDto {}
export class ViewCourseSessionDetailDataResponse extends DataResponse(ViewCourseSessionDetailResponse) {}
