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
exports.ManagementLoginDto = exports.LoginDto = void 0;
const constant_1 = require("../../common/contracts/constant");
const email_dto_1 = require("../../common/dto/email.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LoginDto extends email_dto_1.EmailDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class ManagementLoginDto extends LoginDto {
}
exports.ManagementLoginDto = ManagementLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: [constant_1.UserRole.ADMIN, constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER] }),
    (0, class_validator_1.IsIn)([constant_1.UserRole.ADMIN, constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER]),
    __metadata("design:type", String)
], ManagementLoginDto.prototype, "role", void 0);
//# sourceMappingURL=login.dto.js.map