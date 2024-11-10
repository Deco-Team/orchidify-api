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
exports.BaseRecruitmentDto = exports.RecruitmentStatusHistoryDto = exports.ApplicationInfoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const mongoose_1 = require("mongoose");
class ApplicationInfoDto {
}
exports.ApplicationInfoDto = ApplicationInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfoDto.prototype, "cv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfoDto.prototype, "note", void 0);
class RecruitmentStatusHistoryDto {
}
exports.RecruitmentStatusHistoryDto = RecruitmentStatusHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.RecruitmentStatus }),
    __metadata("design:type", String)
], RecruitmentStatusHistoryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], RecruitmentStatusHistoryDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], RecruitmentStatusHistoryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], RecruitmentStatusHistoryDto.prototype, "userRole", void 0);
class BaseRecruitmentDto {
}
exports.BaseRecruitmentDto = BaseRecruitmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseRecruitmentDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ApplicationInfoDto }),
    __metadata("design:type", ApplicationInfoDto)
], BaseRecruitmentDto.prototype, "applicationInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BaseRecruitmentDto.prototype, "meetingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.RecruitmentStatus }),
    (0, class_validator_1.IsEnum)(constant_1.RecruitmentStatus),
    __metadata("design:type", String)
], BaseRecruitmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RecruitmentStatusHistoryDto, isArray: true }),
    __metadata("design:type", Array)
], BaseRecruitmentDto.prototype, "histories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseRecruitmentDto.prototype, "rejectReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseRecruitmentDto.prototype, "isInstructorAdded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BaseRecruitmentDto.prototype, "handledBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseRecruitmentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseRecruitmentDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.recruitment.dto.js.map