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
exports.UserDeviceDetailDataResponse = exports.CreateUserDeviceDto = exports.BaseUserDeviceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const constant_2 = require("../../common/contracts/constant");
const mongoose_1 = require("mongoose");
class BaseUserDeviceDto {
}
exports.BaseUserDeviceDto = BaseUserDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], BaseUserDeviceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsEnum)(constant_2.UserRole),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "userRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsEnum)(constant_2.UserDeviceStatus),
    __metadata("design:type", String)
], BaseUserDeviceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseUserDeviceDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseUserDeviceDto.prototype, "updatedAt", void 0);
class CreateUserDeviceDto extends (0, swagger_1.PickType)(BaseUserDeviceDto, ['fcmToken', 'browser', 'os']) {
}
exports.CreateUserDeviceDto = CreateUserDeviceDto;
class UserDeviceDetailResponse extends (0, swagger_1.PickType)(BaseUserDeviceDto, constant_1.USER_DEVICE_LIST_PROJECTION) {
}
class UserDeviceDetailDataResponse extends (0, openapi_builder_1.DataResponse)(UserDeviceDetailResponse) {
}
exports.UserDeviceDetailDataResponse = UserDeviceDetailDataResponse;
//# sourceMappingURL=user-device.dto.js.map