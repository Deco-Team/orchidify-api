import { BaseReportDto } from './base.report.dto';
import { ClassStatus } from '@common/contracts/constant';
export declare class QueryReportClassByMonthDto {
    year: number;
}
declare class ReportTotalSummaryReportListItemResponse extends BaseReportDto {
}
declare class ReportTotalSummaryListResponse {
    docs: ReportTotalSummaryReportListItemResponse[];
}
declare const ReportTotalSummaryListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportTotalSummaryListResponse;
}>;
export declare class ReportTotalSummaryListDataResponse extends ReportTotalSummaryListDataResponse_base {
}
declare class ReportUserQuantityResponse {
    quantity: number;
}
declare class ReportUserByMonthListItemResponse {
    learner: ReportUserQuantityResponse;
    instructor: ReportUserQuantityResponse;
}
declare class ReportUserByMonthListResponse {
    docs: ReportUserByMonthListItemResponse[];
}
declare const ReportUserByMonthListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportUserByMonthListResponse;
}>;
export declare class ReportUserByMonthListDataResponse extends ReportUserByMonthListDataResponse_base {
}
declare class ReportClassByStatusListItemResponse {
    quantity: number;
    status: ClassStatus;
}
declare class ReportClassByStatusListResponse {
    quantity: number;
    docs: ReportClassByStatusListItemResponse[];
}
declare const ReportClassByStatusListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportClassByStatusListResponse;
}>;
export declare class ReportClassByStatusListDataResponse extends ReportClassByStatusListDataResponse_base {
}
export {};
