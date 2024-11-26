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
exports.ReportDetailDataResponse = exports.ReportListDataResponse = exports.QueryReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base.report.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
class QueryReportDto {
}
exports.QueryReportDto = QueryReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constant_1.ReportType
    }),
    (0, class_validator_1.IsEnum)(constant_1.ReportType),
    __metadata("design:type", String)
], QueryReportDto.prototype, "type", void 0);
class ReportListItemResponse extends base_report_dto_1.BaseReportDto {
}
class ReportListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ReportListResponse.prototype, "docs", void 0);
class ReportListDataResponse extends (0, openapi_builder_1.DataResponse)(ReportListResponse) {
}
exports.ReportListDataResponse = ReportListDataResponse;
class ReportDetailResponse extends base_report_dto_1.BaseReportDto {
}
class ReportDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ReportDetailResponse) {
}
exports.ReportDetailDataResponse = ReportDetailDataResponse;
//# sourceMappingURL=view-report.dto.js.map