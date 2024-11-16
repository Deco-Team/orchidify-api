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
exports.StaffViewClassRequestDetailDataResponse = exports.StaffViewClassRequestListDataResponse = exports.InstructorViewClassRequestDetailDataResponse = exports.InstructorViewClassRequestListDataResponse = exports.QueryClassRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_class_request_dto_1 = require("./base.class-request.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const base_instructor_dto_1 = require("../../instructor/dto/base.instructor.dto");
const base_class_dto_1 = require("../../class/dto/base.class.dto");
class QueryClassRequestDto {
}
exports.QueryClassRequestDto = QueryClassRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_1.ClassRequestType.PUBLISH_CLASS, constant_1.ClassRequestType.CANCEL_CLASS],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryClassRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [
            constant_1.ClassRequestStatus.PENDING,
            constant_1.ClassRequestStatus.APPROVED,
            constant_1.ClassRequestStatus.CANCELED,
            constant_1.ClassRequestStatus.EXPIRED,
            constant_1.ClassRequestStatus.REJECTED
        ],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryClassRequestDto.prototype, "status", void 0);
class InstructorViewClassRequestListItemResponse extends (0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, constant_2.CLASS_REQUEST_LIST_PROJECTION) {
}
class InstructorViewClassRequestListResponse extends (0, openapi_builder_1.PaginateResponse)(InstructorViewClassRequestListItemResponse) {
}
class InstructorViewClassRequestListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewClassRequestListResponse) {
}
exports.InstructorViewClassRequestListDataResponse = InstructorViewClassRequestListDataResponse;
class InstructorViewClassRequestDetailResponse extends (0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, constant_2.CLASS_REQUEST_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: base_class_dto_1.BaseClassDto }),
    __metadata("design:type", base_class_dto_1.BaseClassDto)
], InstructorViewClassRequestDetailResponse.prototype, "class", void 0);
class InstructorViewClassRequestDetailDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewClassRequestDetailResponse) {
}
exports.InstructorViewClassRequestDetailDataResponse = InstructorViewClassRequestDetailDataResponse;
class ClassRequestCreatedByDto extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['_id', 'name', 'email', 'idCardPhoto', 'avatar']) {
}
class StaffViewClassRequestListItemResponse extends (0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, constant_2.CLASS_REQUEST_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassRequestCreatedByDto }),
    __metadata("design:type", Object)
], StaffViewClassRequestListItemResponse.prototype, "createdBy", void 0);
class StaffViewClassRequestListResponse extends (0, openapi_builder_1.PaginateResponse)(StaffViewClassRequestListItemResponse) {
}
class StaffViewClassRequestListDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewClassRequestListResponse) {
}
exports.StaffViewClassRequestListDataResponse = StaffViewClassRequestListDataResponse;
class StaffViewClassRequestDetailResponse extends InstructorViewClassRequestDetailResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassRequestCreatedByDto }),
    __metadata("design:type", Object)
], StaffViewClassRequestDetailResponse.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: base_class_dto_1.BaseClassDto }),
    __metadata("design:type", base_class_dto_1.BaseClassDto)
], StaffViewClassRequestDetailResponse.prototype, "class", void 0);
class StaffViewClassRequestDetailDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewClassRequestDetailResponse) {
}
exports.StaffViewClassRequestDetailDataResponse = StaffViewClassRequestDetailDataResponse;
//# sourceMappingURL=view-class-request.dto.js.map