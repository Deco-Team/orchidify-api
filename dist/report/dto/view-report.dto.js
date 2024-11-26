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
exports.ReportClassByStatusListDataResponse = exports.ReportUserByMonthListDataResponse = exports.ReportTotalSummaryListDataResponse = exports.QueryReportClassByMonthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base.report.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
class QueryReportClassByMonthDto {
}
exports.QueryReportClassByMonthDto = QueryReportClassByMonthDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2024),
    (0, class_validator_1.Max)(2024),
    __metadata("design:type", Number)
], QueryReportClassByMonthDto.prototype, "year", void 0);
class ReportTotalSummaryReportListItemResponse extends base_report_dto_1.BaseReportDto {
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
class ReportUserQuantityResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ReportUserQuantityResponse.prototype, "quantity", void 0);
class ReportUserByMonthListItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportUserQuantityResponse }),
    __metadata("design:type", ReportUserQuantityResponse)
], ReportUserByMonthListItemResponse.prototype, "learner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportUserQuantityResponse }),
    __metadata("design:type", ReportUserQuantityResponse)
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
//# sourceMappingURL=view-report.dto.js.map