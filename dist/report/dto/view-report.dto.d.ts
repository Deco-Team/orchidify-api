import { BaseReportDto } from './base.report.dto';
import { ClassStatus, StaffStatus } from '@common/contracts/constant';
export declare class QueryReportByMonthDto {
    year: number;
}
export declare class QueryReportByWeekDto {
    date: Date;
}
declare const ReportTotalSummaryReportListItemResponse_base: import("@nestjs/common").Type<Pick<BaseReportDto, "data" | "type" | "_id">>;
declare class ReportTotalSummaryReportListItemResponse extends ReportTotalSummaryReportListItemResponse_base {
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
declare class ReportRevenueResponse {
    total: number;
}
declare class ReportRevenueByMonthListItemResponse {
    revenue: ReportRevenueResponse;
}
declare class ReportRevenueByMonthListResponse {
    docs: ReportRevenueByMonthListItemResponse[];
}
declare const ReportRevenueByMonthListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportRevenueByMonthListResponse;
}>;
export declare class ReportRevenueByMonthListDataResponse extends ReportRevenueByMonthListDataResponse_base {
}
declare class ReportStaffByStatusListItemResponse {
    quantity: number;
    status: StaffStatus;
}
declare class ReportStaffByStatusListResponse {
    quantity: number;
    docs: ReportStaffByStatusListItemResponse[];
}
declare const ReportStaffByStatusListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportStaffByStatusListResponse;
}>;
export declare class ReportStaffByStatusListDataResponse extends ReportStaffByStatusListDataResponse_base {
}
declare class ReportTransactionByDateListItemResponse {
    _id: string;
    date: Date;
    paymentAmount: number;
    payoutAmount: number;
}
declare class ReportTransactionByDateListResponse {
    docs: ReportTransactionByDateListItemResponse[];
}
declare const ReportTransactionByDateListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportTransactionByDateListResponse;
}>;
export declare class ReportTransactionByDateListDataResponse extends ReportTransactionByDateListDataResponse_base {
}
declare class ReportTransactionCountByMonthListItemResponse {
    _id: string;
    quantity: number;
    month: number;
}
declare class ReportTransactionCountByMonthListResponse {
    docs: ReportTransactionCountByMonthListItemResponse[];
}
declare const ReportTransactionCountByMonthListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ReportTransactionCountByMonthListResponse;
}>;
export declare class ReportTransactionCountByMonthListDataResponse extends ReportTransactionCountByMonthListDataResponse_base {
}
export {};
