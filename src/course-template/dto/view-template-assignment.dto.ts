import { DataResponse } from '@common/contracts/openapi-builder'
import { BaseAssignmentDto } from '@course/dto/assignment.dto';

class ViewTemplateAssignmentDetailResponse extends BaseAssignmentDto {}
export class ViewTemplateAssignmentDetailDataResponse extends DataResponse(ViewTemplateAssignmentDetailResponse) {}
