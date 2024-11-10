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
exports.UploadMediaViaBase64DataResponseDto = exports.UploadMediaViaBase64Dto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
class UploadMediaViaBase64Dto {
}
exports.UploadMediaViaBase64Dto = UploadMediaViaBase64Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4...' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadMediaViaBase64Dto.prototype, "contents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constant_1.MediaType),
    __metadata("design:type", String)
], UploadMediaViaBase64Dto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'public_id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadMediaViaBase64Dto.prototype, "public_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'images' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadMediaViaBase64Dto.prototype, "folder", void 0);
class UploadMediaViaBase64ResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '15a66cd41cb44ebdc518f767a2fffb52' }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'images/jlhqjvxdqjshg9xtfvkt' }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "public_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'jpg' }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaResourceType }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "resource_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: '2024-09-14T06:51:27Z' }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaType }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'http://res.cloudinary.com/orchidify/image/authenticated/s--hJ8eOb6---/v1726296687/orchidify_upload/jlhqjvxdqjshg9xtfvkt.jpg'
    }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'images' }),
    __metadata("design:type", String)
], UploadMediaViaBase64ResponseDto.prototype, "asset_folder", void 0);
class UploadMediaViaBase64DataResponseDto extends (0, openapi_builder_1.DataResponse)(UploadMediaViaBase64ResponseDto) {
}
exports.UploadMediaViaBase64DataResponseDto = UploadMediaViaBase64DataResponseDto;
//# sourceMappingURL=upload-media-via-base64.dto.js.map