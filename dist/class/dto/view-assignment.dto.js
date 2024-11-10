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
exports.ViewAssignmentDetailDataResponse = void 0;
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const assignment_dto_1 = require("./assignment.dto");
const swagger_1 = require("@nestjs/swagger");
const assignment_submission_dto_1 = require("./assignment-submission.dto");
class ViewAssignmentDetailResponse extends assignment_dto_1.BaseAssignmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ViewAssignmentDetailResponse.prototype, "sessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: assignment_submission_dto_1.BaseAssignmentSubmissionDto }),
    __metadata("design:type", assignment_submission_dto_1.BaseAssignmentSubmissionDto)
], ViewAssignmentDetailResponse.prototype, "submission", void 0);
class ViewAssignmentDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ViewAssignmentDetailResponse) {
}
exports.ViewAssignmentDetailDataResponse = ViewAssignmentDetailDataResponse;
//# sourceMappingURL=view-assignment.dto.js.map