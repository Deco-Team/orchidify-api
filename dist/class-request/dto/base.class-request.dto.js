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
exports.BaseClassRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const class_request_schema_1 = require("../schemas/class-request.schema");
const base_class_dto_1 = require("../../class/dto/base.class.dto");
class BaseClassRequestMetadataDto extends base_class_dto_1.BaseClassDto {
}
class BaseClassRequestDto {
}
exports.BaseClassRequestDto = BaseClassRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseClassRequestDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.ClassRequestType }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(constant_1.ClassRequestType),
    __metadata("design:type", String)
], BaseClassRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.ClassRequestStatus }),
    (0, class_validator_1.IsEnum)(constant_1.ClassRequestStatus),
    __metadata("design:type", String)
], BaseClassRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], BaseClassRequestDto.prototype, "rejectReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: class_request_schema_1.ClassRequestStatusHistory, isArray: true }),
    __metadata("design:type", Array)
], BaseClassRequestDto.prototype, "histories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Class Request description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseClassRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BaseClassRequestMetadataDto }),
    __metadata("design:type", BaseClassRequestMetadataDto)
], BaseClassRequestDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BaseClassRequestDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BaseClassRequestDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BaseClassRequestDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseClassRequestDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseClassRequestDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.class-request.dto.js.map