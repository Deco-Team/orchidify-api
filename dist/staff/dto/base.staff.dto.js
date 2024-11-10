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
exports.BaseStaffDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const email_dto_1 = require("../../common/dto/email.dto");
class BaseStaffDto extends email_dto_1.EmailDto {
}
exports.BaseStaffDto = BaseStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "staffCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "idCardPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.StaffStatus }),
    (0, class_validator_1.IsEnum)(constant_1.StaffStatus),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: [constant_1.UserRole.ADMIN, constant_1.UserRole.STAFF] }),
    (0, class_validator_1.IsEnum)([constant_1.UserRole.ADMIN, constant_1.UserRole.STAFF]),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseStaffDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseStaffDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.staff.dto.js.map