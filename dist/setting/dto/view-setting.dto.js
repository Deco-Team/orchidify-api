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
exports.CourseTypesSettingDetailDataResponse = exports.SettingDetailDataResponse = exports.SettingListDataResponse = exports.QuerySettingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_setting_dto_1 = require("./base.setting.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
class QuerySettingDto {
}
exports.QuerySettingDto = QuerySettingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constant_1.SettingKey
    }),
    (0, class_validator_1.IsEnum)(constant_1.SettingKey),
    __metadata("design:type", String)
], QuerySettingDto.prototype, "key", void 0);
class SettingListItemResponse extends base_setting_dto_1.BaseSettingDto {
}
class SettingListResponse extends (0, openapi_builder_1.PaginateResponse)(SettingListItemResponse) {
}
class SettingListDataResponse extends (0, openapi_builder_1.DataResponse)(SettingListResponse) {
}
exports.SettingListDataResponse = SettingListDataResponse;
class SettingDetailResponse extends base_setting_dto_1.BaseSettingDto {
}
class SettingDetailDataResponse extends (0, openapi_builder_1.DataResponse)(SettingDetailResponse) {
}
exports.SettingDetailDataResponse = SettingDetailDataResponse;
class CourseTypeSettingDetailResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CourseTypeSettingDetailResponse.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", Array)
], CourseTypeSettingDetailResponse.prototype, "groupItems", void 0);
class CourseTypesSettingDetailResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: CourseTypeSettingDetailResponse, isArray: true }),
    __metadata("design:type", Array)
], CourseTypesSettingDetailResponse.prototype, "docs", void 0);
class CourseTypesSettingDetailDataResponse extends (0, openapi_builder_1.DataResponse)(CourseTypesSettingDetailResponse) {
}
exports.CourseTypesSettingDetailDataResponse = CourseTypesSettingDetailDataResponse;
//# sourceMappingURL=view-setting.dto.js.map