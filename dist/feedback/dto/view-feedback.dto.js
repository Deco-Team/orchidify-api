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
exports.InstructorViewCourseFeedbackListDataResponse = exports.CourseFeedbackListDataResponse = exports.InstructorViewClassFeedbackListDataResponse = exports.ClassFeedbackListDataResponse = exports.FeedbackDetailDataResponse = exports.QueryFeedbackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const base_feedback_dto_1 = require("./base.feedback.dto");
const base_learner_dto_1 = require("../../learner/dto/base.learner.dto");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class QueryFeedbackDto {
}
exports.QueryFeedbackDto = QueryFeedbackDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], QueryFeedbackDto.prototype, "rate", void 0);
class FeedbackLearnerDetailResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, constant_1.FEEDBACK_LEANER_DETAIL) {
}
class FeedbackDetailResponse extends (0, swagger_1.PickType)(base_feedback_dto_1.BaseFeedbackDto, constant_1.FEEDBACK_DETAIL_PROJECTION) {
}
class FeedbackDetailDataResponse extends (0, openapi_builder_1.DataResponse)(FeedbackDetailResponse) {
}
exports.FeedbackDetailDataResponse = FeedbackDetailDataResponse;
class FeedbackListItemResponse extends (0, swagger_1.PickType)(base_feedback_dto_1.BaseFeedbackDto, constant_1.FEEDBACK_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: FeedbackLearnerDetailResponse }),
    __metadata("design:type", FeedbackLearnerDetailResponse)
], FeedbackListItemResponse.prototype, "learner", void 0);
class ClassFeedbackListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: FeedbackListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ClassFeedbackListResponse.prototype, "docs", void 0);
class ClassFeedbackListDataResponse extends (0, openapi_builder_1.DataResponse)(ClassFeedbackListResponse) {
}
exports.ClassFeedbackListDataResponse = ClassFeedbackListDataResponse;
class InstructorViewFeedbackListItemResponse extends (0, swagger_1.PickType)(base_feedback_dto_1.BaseFeedbackDto, constant_1.INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION) {
}
class InstructorViewClassFeedbackListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: InstructorViewFeedbackListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], InstructorViewClassFeedbackListResponse.prototype, "docs", void 0);
class InstructorViewClassFeedbackListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewClassFeedbackListResponse) {
}
exports.InstructorViewClassFeedbackListDataResponse = InstructorViewClassFeedbackListDataResponse;
class CourseFeedbackListResponse extends (0, openapi_builder_1.PaginateResponse)(FeedbackListItemResponse) {
}
class CourseFeedbackListDataResponse extends (0, openapi_builder_1.DataResponse)(CourseFeedbackListResponse) {
}
exports.CourseFeedbackListDataResponse = CourseFeedbackListDataResponse;
class InstructorViewCourseFeedbackListResponse extends (0, openapi_builder_1.PaginateResponse)(InstructorViewFeedbackListItemResponse) {
}
class InstructorViewCourseFeedbackListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewCourseFeedbackListResponse) {
}
exports.InstructorViewCourseFeedbackListDataResponse = InstructorViewCourseFeedbackListDataResponse;
//# sourceMappingURL=view-feedback.dto.js.map