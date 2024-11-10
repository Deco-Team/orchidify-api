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
exports.BaseInstructorDto = exports.PaymentInfoDto = exports.InstructorCertificateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const email_dto_1 = require("../../common/dto/email.dto");
const class_transformer_1 = require("class-transformer");
const past_year_validator_1 = require("../../common/validators/past-year.validator");
class InstructorCertificateDto {
}
exports.InstructorCertificateDto = InstructorCertificateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], InstructorCertificateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], InstructorCertificateDto.prototype, "url", void 0);
class PaymentInfoDto {
}
exports.PaymentInfoDto = PaymentInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "bankShortName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "accountName", void 0);
class BaseInstructorDto extends email_dto_1.EmailDto {
}
exports.BaseInstructorDto = BaseInstructorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.Matches)(/^[+]?\d{10,12}$/),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsOptional)(),
    (0, past_year_validator_1.PastYear)(18),
    __metadata("design:type", Date)
], BaseInstructorDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: InstructorCertificateDto, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => InstructorCertificateDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseInstructorDto.prototype, "certificates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "idCardPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.InstructorStatus }),
    (0, class_validator_1.IsEnum)(constant_1.InstructorStatus),
    __metadata("design:type", String)
], BaseInstructorDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BaseInstructorDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaymentInfoDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => PaymentInfoDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PaymentInfoDto)
], BaseInstructorDto.prototype, "paymentInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseInstructorDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseInstructorDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.instructor.dto.js.map