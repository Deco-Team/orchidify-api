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
exports.StaffDetailDataResponse = exports.StaffListDataResponse = exports.QueryStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_staff_dto_1 = require("./base.staff.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
class QueryStaffDto {
}
exports.QueryStaffDto = QueryStaffDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryStaffDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_1.StaffStatus,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryStaffDto.prototype, "status", void 0);
class StaffDetailResponse extends (0, swagger_1.PickType)(base_staff_dto_1.BaseStaffDto, constant_2.STAFF_LIST_PROJECTION) {
}
class StaffListResponse extends (0, openapi_builder_1.PaginateResponse)(StaffDetailResponse) {
}
class StaffListDataResponse extends (0, openapi_builder_1.DataResponse)(StaffListResponse) {
}
exports.StaffListDataResponse = StaffListDataResponse;
class StaffDetailDataResponse extends (0, openapi_builder_1.DataResponse)(StaffDetailResponse) {
}
exports.StaffDetailDataResponse = StaffDetailDataResponse;
//# sourceMappingURL=view-staff.dto.js.map