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
exports.LearnerListDataResponse = exports.LearnerDetailDataResponse = exports.LearnerDetailResponse = exports.LearnerProfileDataResponse = exports.QueryLearnerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_learner_dto_1 = require("./base.learner.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const constant_2 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
class QueryLearnerDto {
}
exports.QueryLearnerDto = QueryLearnerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryLearnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryLearnerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_2.LearnerStatus.ACTIVE, constant_2.LearnerStatus.INACTIVE],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryLearnerDto.prototype, "status", void 0);
class LearnerProfileResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, constant_1.LEARNER_PROFILE_PROJECTION) {
}
class LearnerProfileDataResponse extends (0, openapi_builder_1.DataResponse)(LearnerProfileResponse) {
}
exports.LearnerProfileDataResponse = LearnerProfileDataResponse;
class LearnerDetailResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, constant_1.LEARNER_DETAIL_PROJECTION) {
}
exports.LearnerDetailResponse = LearnerDetailResponse;
class LearnerDetailDataResponse extends (0, openapi_builder_1.DataResponse)(LearnerDetailResponse) {
}
exports.LearnerDetailDataResponse = LearnerDetailDataResponse;
class LearnerListItemResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, constant_1.LEARNER_LIST_PROJECTION) {
}
class LearnerListResponse extends (0, openapi_builder_1.PaginateResponse)(LearnerListItemResponse) {
}
class LearnerListDataResponse extends (0, openapi_builder_1.DataResponse)(LearnerListResponse) {
}
exports.LearnerListDataResponse = LearnerListDataResponse;
//# sourceMappingURL=view-learner.dto.js.map