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
exports.ViewerViewInstructorDetailDataResponse = exports.InstructorListDataResponse = exports.InstructorDetailDataResponse = exports.QueryInstructorDto = exports.InstructorCertificationsDataResponse = exports.InstructorProfileDataResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_instructor_dto_1 = require("./base.instructor.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const constant_2 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
class InstructorProfileResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_1.INSTRUCTOR_PROFILE_PROJECTION) {
}
class InstructorProfileDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorProfileResponse) {
}
exports.InstructorProfileDataResponse = InstructorProfileDataResponse;
class InstructorCertificationsResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: base_instructor_dto_1.InstructorCertificateDto, isArray: true }),
    __metadata("design:type", Array)
], InstructorCertificationsResponse.prototype, "docs", void 0);
class InstructorCertificationsDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorCertificationsResponse) {
}
exports.InstructorCertificationsDataResponse = InstructorCertificationsDataResponse;
class QueryInstructorDto {
}
exports.QueryInstructorDto = QueryInstructorDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryInstructorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryInstructorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_2.InstructorStatus.ACTIVE, constant_2.InstructorStatus.INACTIVE],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryInstructorDto.prototype, "status", void 0);
class InstructorDetailResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_1.INSTRUCTOR_DETAIL_PROJECTION) {
}
class InstructorDetailDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorDetailResponse) {
}
exports.InstructorDetailDataResponse = InstructorDetailDataResponse;
class InstructorListItemResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_1.INSTRUCTOR_LIST_PROJECTION) {
}
class InstructorListResponse extends (0, openapi_builder_1.PaginateResponse)(InstructorListItemResponse) {
}
class InstructorListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorListResponse) {
}
exports.InstructorListDataResponse = InstructorListDataResponse;
class ViewerViewInstructorDetailResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_1.VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION) {
}
class ViewerViewInstructorDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ViewerViewInstructorDetailResponse) {
}
exports.ViewerViewInstructorDetailDataResponse = ViewerViewInstructorDetailDataResponse;
//# sourceMappingURL=view-instructor.dto.js.map