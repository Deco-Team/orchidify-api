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
exports.GenerateSignedUrlDataResponse = exports.GenerateSignedUrlDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../contracts/constant");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
class GenerateSignedUrlDto {
}
exports.GenerateSignedUrlDto = GenerateSignedUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaType }),
    (0, class_validator_1.IsEnum)(constant_1.MediaType),
    __metadata("design:type", String)
], GenerateSignedUrlDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'public_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateSignedUrlDto.prototype, "public_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'images' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateSignedUrlDto.prototype, "folder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'uw' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Equals)('uw'),
    __metadata("design:type", String)
], GenerateSignedUrlDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'upload_preset' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateSignedUrlDto.prototype, "upload_preset", void 0);
class GenerateSignedUrlResponse extends GenerateSignedUrlDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1726296279' }),
    __metadata("design:type", String)
], GenerateSignedUrlResponse.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'e360bd525b6fbc21bceedbe7d5a9f9a9e0e155e4' }),
    __metadata("design:type", String)
], GenerateSignedUrlResponse.prototype, "signature", void 0);
class GenerateSignedUrlDataResponse extends (0, openapi_builder_1.DataResponse)(GenerateSignedUrlResponse) {
}
exports.GenerateSignedUrlDataResponse = GenerateSignedUrlDataResponse;
//# sourceMappingURL=generate-signed-url.dto.js.map