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
exports.GradeAssignmentSubmissionDto = exports.CreateAssignmentSubmissionDto = exports.BaseAssignmentSubmissionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const constant_1 = require("../../common/contracts/constant");
class BaseAssignmentSubmissionDto {
}
exports.BaseAssignmentSubmissionDto = BaseAssignmentSubmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: base_media_dto_1.BaseMediaDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1),
    (0, class_transformer_1.Type)(() => base_media_dto_1.BaseMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseAssignmentSubmissionDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], BaseAssignmentSubmissionDto.prototype, "point", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'Assignment submission feedback' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "feedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.SubmissionStatus }),
    (0, class_validator_1.IsEnum)(constant_1.SubmissionStatus),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "assignmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseAssignmentSubmissionDto.prototype, "learnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseAssignmentSubmissionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseAssignmentSubmissionDto.prototype, "updatedAt", void 0);
class CreateAssignmentSubmissionDto extends (0, swagger_1.PickType)(BaseAssignmentSubmissionDto, [
    'assignmentId',
    'attachments'
]) {
}
exports.CreateAssignmentSubmissionDto = CreateAssignmentSubmissionDto;
class GradeAssignmentSubmissionDto extends (0, swagger_1.PickType)(BaseAssignmentSubmissionDto, ['point', 'feedback']) {
}
exports.GradeAssignmentSubmissionDto = GradeAssignmentSubmissionDto;
//# sourceMappingURL=assignment-submission.dto.js.map