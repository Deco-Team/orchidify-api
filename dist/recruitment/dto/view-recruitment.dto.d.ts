import { BaseRecruitmentDto } from './base.recruitment.dto';
import { RecruitmentStatus } from '@common/contracts/constant';
import { Staff } from '@staff/schemas/staff.schema';
export declare class QueryRecruitmentDto {
    name: string;
    email: string;
    status: RecruitmentStatus[];
}
declare const RecruitmentDetailResponse_base: import("@nestjs/common").Type<Pick<BaseRecruitmentDto, "status" | "createdAt" | "updatedAt" | "_id" | "applicationInfo" | "meetingUrl" | "meetingDate" | "histories" | "rejectReason" | "handledBy" | "isInstructorAdded">>;
declare class RecruitmentDetailResponse extends RecruitmentDetailResponse_base {
    handledBy: Staff;
}
declare const RecruitmentDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof RecruitmentDetailResponse;
}>;
export declare class RecruitmentDetailDataResponse extends RecruitmentDetailDataResponse_base {
}
declare const RecruitmentListItemResponse_base: import("@nestjs/common").Type<Pick<BaseRecruitmentDto, "status" | "createdAt" | "updatedAt" | "_id" | "applicationInfo" | "meetingUrl" | "rejectReason" | "handledBy">>;
declare class RecruitmentListItemResponse extends RecruitmentListItemResponse_base {
    handledBy: Staff;
}
declare const RecruitmentListResponse_base: import("@nestjs/common").Type<{
    docs: (typeof RecruitmentListItemResponse)[];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page?: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number;
    nextPage?: number;
}>;
declare class RecruitmentListResponse extends RecruitmentListResponse_base {
}
declare const RecruitmentListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof RecruitmentListResponse;
}>;
export declare class RecruitmentListDataResponse extends RecruitmentListDataResponse_base {
}
export {};
