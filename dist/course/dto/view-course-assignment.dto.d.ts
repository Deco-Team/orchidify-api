import { BaseAssignmentDto } from '@src/class/dto/assignment.dto';
declare class ViewCourseAssignmentDetailResponse extends BaseAssignmentDto {
    sessionNumber: number;
}
declare const ViewCourseAssignmentDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewCourseAssignmentDetailResponse;
}>;
export declare class ViewCourseAssignmentDetailDataResponse extends ViewCourseAssignmentDetailDataResponse_base {
}
export {};
