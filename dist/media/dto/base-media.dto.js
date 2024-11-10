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
exports.BaseMediaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../contracts/constant");
class BaseMediaDto {
}
exports.BaseMediaDto = BaseMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '15a66cd41cb44ebdc518f767a2fffb52' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "asset_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'images/hcgbmek4qa8kksw2zrcg' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "public_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaResourceType }),
    (0, class_validator_1.IsEnum)(constant_1.MediaResourceType),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "resource_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.MediaType }),
    (0, class_validator_1.IsEnum)(constant_1.MediaType),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'https://res.cloudinary.com/orchidify/image/upload/v1726377866/hcgbmek4qa8kksw2zrcg.jpg' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: '2024-09-14T06:51:27Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'images' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "asset_folder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'IMG_0207' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "original_filename", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, example: 'JPG' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseMediaDto.prototype, "original_extension", void 0);
//# sourceMappingURL=base-media.dto.js.map