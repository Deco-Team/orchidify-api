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
exports.RecruitmentListDataResponse = exports.RecruitmentDetailDataResponse = exports.QueryRecruitmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_recruitment_dto_1 = require("./base.recruitment.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const constant_2 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const base_staff_dto_1 = require("../../staff/dto/base.staff.dto");
const staff_schema_1 = require("../../staff/schemas/staff.schema");
class QueryRecruitmentDto {
}
exports.QueryRecruitmentDto = QueryRecruitmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name applicant to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryRecruitmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email applicant to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryRecruitmentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [
            constant_2.RecruitmentStatus.PENDING,
            constant_2.RecruitmentStatus.INTERVIEWING,
            constant_2.RecruitmentStatus.SELECTED,
            constant_2.RecruitmentStatus.EXPIRED,
            constant_2.RecruitmentStatus.REJECTED
        ],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryRecruitmentDto.prototype, "status", void 0);
class RecruitmentHandledByDto extends (0, swagger_1.PickType)(base_staff_dto_1.BaseStaffDto, ['_id', 'name']) {
}
class RecruitmentDetailResponse extends (0, swagger_1.PickType)(base_recruitment_dto_1.BaseRecruitmentDto, constant_1.RECRUITMENT_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: RecruitmentHandledByDto }),
    __metadata("design:type", staff_schema_1.Staff)
], RecruitmentDetailResponse.prototype, "handledBy", void 0);
class RecruitmentDetailDataResponse extends (0, openapi_builder_1.DataResponse)(RecruitmentDetailResponse) {
}
exports.RecruitmentDetailDataResponse = RecruitmentDetailDataResponse;
class RecruitmentListItemResponse extends (0, swagger_1.PickType)(base_recruitment_dto_1.BaseRecruitmentDto, constant_1.RECRUITMENT_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: RecruitmentHandledByDto }),
    __metadata("design:type", staff_schema_1.Staff)
], RecruitmentListItemResponse.prototype, "handledBy", void 0);
class RecruitmentListResponse extends (0, openapi_builder_1.PaginateResponse)(RecruitmentListItemResponse) {
}
class RecruitmentListDataResponse extends (0, openapi_builder_1.DataResponse)(RecruitmentListResponse) {
}
exports.RecruitmentListDataResponse = RecruitmentListDataResponse;
//# sourceMappingURL=view-recruitment.dto.js.map