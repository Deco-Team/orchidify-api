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
exports.BaseTransactionDto = exports.BasePayoutDto = exports.BasePaymentDto = exports.BaseTransactionAccountDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const mongoose_1 = require("mongoose");
class BaseTransactionAccountDto {
}
exports.BaseTransactionAccountDto = BaseTransactionAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], BaseTransactionAccountDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], BaseTransactionAccountDto.prototype, "userRole", void 0);
class BasePaymentDto {
}
exports.BasePaymentDto = BasePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePaymentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePaymentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BasePaymentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], BasePaymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], BasePaymentDto.prototype, "orderInfo", void 0);
class BasePayoutDto {
}
exports.BasePayoutDto = BasePayoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePayoutDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePayoutDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BasePayoutDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], BasePayoutDto.prototype, "status", void 0);
class BaseTransactionDto {
}
exports.BaseTransactionDto = BaseTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseTransactionDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_2.TransactionType }),
    (0, class_validator_1.IsEnum)(constant_2.TransactionType),
    __metadata("design:type", String)
], BaseTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, enum: constant_2.PaymentMethod }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constant_2.PaymentMethod),
    __metadata("design:type", String)
], BaseTransactionDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 500000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(10000000),
    __metadata("design:type", Number)
], BaseTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BaseTransactionAccountDto }),
    (0, class_transformer_1.Type)(() => BaseTransactionAccountDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", BaseTransactionAccountDto)
], BaseTransactionDto.prototype, "debitAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BaseTransactionAccountDto }),
    (0, class_transformer_1.Type)(() => BaseTransactionAccountDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", BaseTransactionAccountDto)
], BaseTransactionDto.prototype, "creditAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Transaction description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.TransactionStatus }),
    (0, class_validator_1.IsEnum)(constant_1.TransactionStatus),
    __metadata("design:type", String)
], BaseTransactionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BasePaymentDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BasePaymentDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", BasePaymentDto)
], BaseTransactionDto.prototype, "payment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BasePayoutDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BasePayoutDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", BasePayoutDto)
], BaseTransactionDto.prototype, "payout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseTransactionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseTransactionDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.transaction.dto.js.map