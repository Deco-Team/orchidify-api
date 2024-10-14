import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseSessionDto } from './session.dto'

class ViewSessionDetailResponse extends BaseSessionDto {}
export class ViewSessionDetailDataResponse extends DataResponse(ViewSessionDetailResponse) {}
