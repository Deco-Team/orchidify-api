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
exports.ViewAssignmentSubmissionDetailDataResponse = exports.AssignmentSubmissionListDataResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const base_learner_dto_1 = require("../../learner/dto/base.learner.dto");
const assignment_submission_dto_1 = require("./assignment-submission.dto");
class SubmissionLearnerDetailResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, ['_id', 'name', 'email', 'avatar']) {
}
class AssignmentSubmissionItemResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubmissionLearnerDetailResponse }),
    __metadata("design:type", SubmissionLearnerDetailResponse)
], AssignmentSubmissionItemResponse.prototype, "learner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: assignment_submission_dto_1.BaseAssignmentSubmissionDto }),
    __metadata("design:type", assignment_submission_dto_1.BaseAssignmentSubmissionDto)
], AssignmentSubmissionItemResponse.prototype, "submission", void 0);
class AssignmentSubmissionListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: AssignmentSubmissionItemResponse, isArray: true }),
    __metadata("design:type", Array)
], AssignmentSubmissionListResponse.prototype, "docs", void 0);
class AssignmentSubmissionListDataResponse extends (0, openapi_builder_1.DataResponse)(AssignmentSubmissionListResponse) {
}
exports.AssignmentSubmissionListDataResponse = AssignmentSubmissionListDataResponse;
class ViewAssignmentSubmissionDetailResponse extends assignment_submission_dto_1.BaseAssignmentSubmissionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubmissionLearnerDetailResponse }),
    __metadata("design:type", SubmissionLearnerDetailResponse)
], ViewAssignmentSubmissionDetailResponse.prototype, "learner", void 0);
class ViewAssignmentSubmissionDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ViewAssignmentSubmissionDetailResponse) {
}
exports.ViewAssignmentSubmissionDetailDataResponse = ViewAssignmentSubmissionDetailDataResponse;
//# sourceMappingURL=view-assignment-submission.dto.js.map