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
exports.ViewPayoutUsageDataResponse = exports.StaffViewPayoutRequestDetailDataResponse = exports.StaffViewPayoutRequestListDataResponse = exports.InstructorViewPayoutRequestDetailDataResponse = exports.InstructorViewPayoutRequestListDataResponse = exports.QueryPayoutRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_payout_request_dto_1 = require("./base.payout-request.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const base_instructor_dto_1 = require("../../instructor/dto/base.instructor.dto");
class QueryPayoutRequestDto {
}
exports.QueryPayoutRequestDto = QueryPayoutRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [
            constant_1.PayoutRequestStatus.PENDING,
            constant_1.PayoutRequestStatus.APPROVED,
            constant_1.PayoutRequestStatus.CANCELED,
            constant_1.PayoutRequestStatus.EXPIRED,
            constant_1.PayoutRequestStatus.REJECTED
        ],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryPayoutRequestDto.prototype, "status", void 0);
class InstructorViewPayoutRequestListItemResponse extends (0, swagger_1.PickType)(base_payout_request_dto_1.BasePayoutRequestDto, constant_2.PAYOUT_REQUEST_LIST_PROJECTION) {
}
class InstructorViewPayoutRequestListResponse extends (0, openapi_builder_1.PaginateResponse)(InstructorViewPayoutRequestListItemResponse) {
}
class InstructorViewPayoutRequestListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewPayoutRequestListResponse) {
}
exports.InstructorViewPayoutRequestListDataResponse = InstructorViewPayoutRequestListDataResponse;
class InstructorViewPayoutRequestDetailResponse extends (0, swagger_1.PickType)(base_payout_request_dto_1.BasePayoutRequestDto, constant_2.PAYOUT_REQUEST_DETAIL_PROJECTION) {
}
class InstructorViewPayoutRequestDetailDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewPayoutRequestDetailResponse) {
}
exports.InstructorViewPayoutRequestDetailDataResponse = InstructorViewPayoutRequestDetailDataResponse;
class PayoutRequestCreatedByDto extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, [
    '_id',
    'name',
    'phone',
    'email',
    'idCardPhoto',
    'avatar',
    'paymentInfo'
]) {
}
class StaffViewPayoutRequestListItemResponse extends (0, swagger_1.PickType)(base_payout_request_dto_1.BasePayoutRequestDto, constant_2.PAYOUT_REQUEST_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: PayoutRequestCreatedByDto }),
    __metadata("design:type", Object)
], StaffViewPayoutRequestListItemResponse.prototype, "createdBy", void 0);
class StaffViewPayoutRequestListResponse extends (0, openapi_builder_1.PaginateResponse)(StaffViewPayoutRequestListItemResponse) {
}
class StaffViewPayoutRequestListDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewPayoutRequestListResponse) {
}
exports.StaffViewPayoutRequestListDataResponse = StaffViewPayoutRequestListDataResponse;
class StaffViewPayoutRequestDetailResponse extends InstructorViewPayoutRequestDetailResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: PayoutRequestCreatedByDto }),
    __metadata("design:type", Object)
], StaffViewPayoutRequestDetailResponse.prototype, "createdBy", void 0);
class StaffViewPayoutRequestDetailDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewPayoutRequestDetailResponse) {
}
exports.StaffViewPayoutRequestDetailDataResponse = StaffViewPayoutRequestDetailDataResponse;
class ViewPayoutUsageResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ViewPayoutUsageResponse.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ViewPayoutUsageResponse.prototype, "usage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ViewPayoutUsageResponse.prototype, "count", void 0);
class ViewPayoutUsageDataResponse extends (0, openapi_builder_1.DataResponse)(ViewPayoutUsageResponse) {
}
exports.ViewPayoutUsageDataResponse = ViewPayoutUsageDataResponse;
//# sourceMappingURL=view-payout-request.dto.js.map