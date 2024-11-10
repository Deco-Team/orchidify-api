import { BaseAssignmentDto } from './assignment.dto';
import { BaseAssignmentSubmissionDto } from './assignment-submission.dto';
declare class ViewAssignmentDetailResponse extends BaseAssignmentDto {
    sessionNumber: number;
    submission: BaseAssignmentSubmissionDto;
}
declare const ViewAssignmentDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewAssignmentDetailResponse;
}>;
export declare class ViewAssignmentDetailDataResponse extends ViewAssignmentDetailDataResponse_base {
}
export {};
