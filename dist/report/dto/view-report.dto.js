"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportLearnerByStatusListDataResponse = exports.ReportInstructorByStatusListDataResponse = exports.ReportClassByRateListDataResponse = exports.ReportCourseByRateListDataResponse = exports.ReportCourseByMonthListDataResponse = exports.ReportTransactionCountByMonthListDataResponse = exports.ReportTransactionByDateListDataResponse = exports.ReportStaffByStatusListDataResponse = exports.ReportRevenueByMonthListDataResponse = exports.ReportClassByStatusListDataResponse = exports.ReportLearnerByMonthListDataResponse = exports.ReportInstructorByMonthListDataResponse = exports.ReportUserByMonthListDataResponse = exports.ReportTotalSummaryListDataResponse = exports.QueryReportByWeekDto = exports.QueryReportByMonthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base.report.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
class QueryReportByMonthDto {
}
exports.QueryReportByMonthDto = QueryReportByMonthDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2024),
    (0, class_validator_1.Max)(2024),
    __metadata("design:type", Number)
], QueryReportByMonthDto.prototype, "year", void 0);
class QueryReportByWeekDto {
}
exports.QueryReportByWeekDto = QueryReportByWeekDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2024-09-20' }),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], QueryReportByWeekDto.prototype, "date", void 0);
class ReportTotalSummaryReportListItemResponse extends (0, swagger_1.PickType)(base_report_dto_1.BaseReportDto, ['_id', 'type', 'data']) {
}
class ReportTotalSummaryListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportTotalSummaryReportListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportTotalSummaryListResponse.prototype, "docs", void 0);
class ReportTotalSummaryListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportTotalSummaryListResponse) {
}
exports.ReportTotalSummaryListDataResponse = ReportTotalSummaryListDataResponse;
class ReportQuantityResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportQuantityResponse.prototype, "quantity", void 0);
class ReportUserByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportQuantityResponse }),
    __metadata("design:type", ReportQuantityResponse)
], ReportUserByMonthListItemResponse.prototype, "learner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportQuantityResponse }),
    __metadata("design:type", ReportQuantityResponse)
], ReportUserByMonthListItemResponse.prototype, "instructor", void 0);
class ReportUserByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportUserByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportUserByMonthListResponse.prototype, "docs", void 0);
class ReportUserByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportUserByMonthListResponse) {
}
exports.ReportUserByMonthListDataResponse = ReportUserByMonthListDataResponse;
class ReportInstructorByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportQuantityResponse }),
    __metadata("design:type", ReportQuantityResponse)
], ReportInstructorByMonthListItemResponse.prototype, "instructor", void 0);
class ReportInstructorByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportInstructorByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportInstructorByMonthListResponse.prototype, "docs", void 0);
class ReportInstructorByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportInstructorByMonthListResponse) {
}
exports.ReportInstructorByMonthListDataResponse = ReportInstructorByMonthListDataResponse;
class ReportLearnerByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportQuantityResponse }),
    __metadata("design:type", ReportQuantityResponse)
], ReportLearnerByMonthListItemResponse.prototype, "learner", void 0);
class ReportLearnerByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportLearnerByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportLearnerByMonthListResponse.prototype, "docs", void 0);
class ReportLearnerByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportLearnerByMonthListResponse) {
}
exports.ReportLearnerByMonthListDataResponse = ReportLearnerByMonthListDataResponse;
class ReportClassByStatusListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportClassByStatusListItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.ClassStatus }),
    __metadata("design:type", String)
], ReportClassByStatusListItemResponse.prototype, "status", void 0);
class ReportClassByStatusListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportClassByStatusListResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportClassByStatusListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportClassByStatusListResponse.prototype, "docs", void 0);
class ReportClassByStatusListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportClassByStatusListResponse) {
}
exports.ReportClassByStatusListDataResponse = ReportClassByStatusListDataResponse;
class ReportRevenueResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportRevenueResponse.prototype, "total", void 0);
class ReportRevenueByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportRevenueResponse }),
    __metadata("design:type", ReportRevenueResponse)
], ReportRevenueByMonthListItemResponse.prototype, "revenue", void 0);
class ReportRevenueByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportRevenueByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportRevenueByMonthListResponse.prototype, "docs", void 0);
class ReportRevenueByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportRevenueByMonthListResponse) {
}
exports.ReportRevenueByMonthListDataResponse = ReportRevenueByMonthListDataResponse;
class ReportStaffByStatusListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportStaffByStatusListItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.StaffStatus }),
    __metadata("design:type", String)
], ReportStaffByStatusListItemResponse.prototype, "status", void 0);
class ReportStaffByStatusListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportStaffByStatusListResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportStaffByStatusListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportStaffByStatusListResponse.prototype, "docs", void 0);
class ReportStaffByStatusListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportStaffByStatusListResponse) {
}
exports.ReportStaffByStatusListDataResponse = ReportStaffByStatusListDataResponse;
class ReportTransactionByDateListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ReportTransactionByDateListItemResponse.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ReportTransactionByDateListItemResponse.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportTransactionByDateListItemResponse.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportTransactionByDateListItemResponse.prototype, "payoutAmount", void 0);
class ReportTransactionByDateListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportTransactionByDateListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportTransactionByDateListResponse.prototype, "docs", void 0);
class ReportTransactionByDateListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportTransactionByDateListResponse) {
}
exports.ReportTransactionByDateListDataResponse = ReportTransactionByDateListDataResponse;
class ReportTransactionCountByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ReportTransactionCountByMonthListItemResponse.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportTransactionCountByMonthListItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportTransactionCountByMonthListItemResponse.prototype, "month", void 0);
class ReportTransactionCountByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportTransactionCountByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportTransactionCountByMonthListResponse.prototype, "docs", void 0);
class ReportTransactionCountByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportTransactionCountByMonthListResponse) {
}
exports.ReportTransactionCountByMonthListDataResponse = ReportTransactionCountByMonthListDataResponse;
class ReportCourseByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportQuantityResponse }),
    __metadata("design:type", ReportQuantityResponse)
], ReportCourseByMonthListItemResponse.prototype, "course", void 0);
class ReportCourseByMonthListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportCourseByMonthListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportCourseByMonthListResponse.prototype, "docs", void 0);
class ReportCourseByMonthListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportCourseByMonthListResponse) {
}
exports.ReportCourseByMonthListDataResponse = ReportCourseByMonthListDataResponse;
class ReportCountResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ReportCountResponse.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportCountResponse.prototype, "count", void 0);
class ReportCourseByRateListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportCountResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportCourseByRateListResponse.prototype, "docs", void 0);
class ReportCourseByRateListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportCourseByRateListResponse) {
}
exports.ReportCourseByRateListDataResponse = ReportCourseByRateListDataResponse;
class ReportClassByRateListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportCountResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportClassByRateListResponse.prototype, "docs", void 0);
class ReportClassByRateListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportClassByRateListResponse) {
}
exports.ReportClassByRateListDataResponse = ReportClassByRateListDataResponse;
class ReportInstructorByStatusListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportInstructorByStatusListItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.InstructorStatus }),
    __metadata("design:type", String)
], ReportInstructorByStatusListItemResponse.prototype, "status", void 0);
class ReportInstructorByStatusListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportInstructorByStatusListResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportInstructorByStatusListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportInstructorByStatusListResponse.prototype, "docs", void 0);
class ReportInstructorByStatusListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportInstructorByStatusListResponse) {
}
exports.ReportInstructorByStatusListDataResponse = ReportInstructorByStatusListDataResponse;
class ReportLearnerByStatusListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportLearnerByStatusListItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.LearnerStatus }),
    __metadata("design:type", String)
], ReportLearnerByStatusListItemResponse.prototype, "status", void 0);
class ReportLearnerByStatusListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportLearnerByStatusListResponse.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportLearnerByStatusListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportLearnerByStatusListResponse.prototype, "docs", void 0);
class ReportLearnerByStatusListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportLearnerByStatusListResponse) {
}
exports.ReportLearnerByStatusListDataResponse = ReportLearnerByStatusListDataResponse;
//# sourceMappingURL=view-report.dto.js.map