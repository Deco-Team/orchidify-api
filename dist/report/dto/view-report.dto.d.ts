import { BaseReportDto } from './base.report.dto';
import { ReportType } from '@report/contracts/constant';
export declare class QueryReportDto {
    type: ReportType;
}
declare class ReportListItemResponse extends BaseReportDto {
}
declare class ReportListResponse {
    docs: ReportListItemResponse[];
}
declare const ReportListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportListResponse;
}>;
export declare class ReportListDataResponse extends ReportListDataResponse_base {
}
declare class ReportDetailResponse extends BaseReportDto {
}
declare const ReportDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportDetailResponse;
}>;
export declare class ReportDetailDataResponse extends ReportDetailDataResponse_base {
}
export {};
