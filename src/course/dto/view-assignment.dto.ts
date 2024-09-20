import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from './assignment.dto';

class ViewAssignmentDetailResponse extends BaseAssignmentDto {}
export class ViewAssignmentDetailDataResponse extends DataResponse(ViewAssignmentDetailResponse) {}
