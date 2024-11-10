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
exports.PaymentPaginateResponseDto = exports.PaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const payos_payment_dto_1 = require("./payos-payment.dto");
class PaymentDto {
}
exports.PaymentDto = PaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.TransactionStatus }),
    __metadata("design:type", String)
], PaymentDto.prototype, "transactionStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", payos_payment_dto_1.PayOSPaymentResponseDto)
], PaymentDto.prototype, "transaction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: payos_payment_dto_1.PayOSPaymentResponseDto }),
    __metadata("design:type", Array)
], PaymentDto.prototype, "transactionHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constant_2.PaymentMethod
    }),
    __metadata("design:type", String)
], PaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "amount", void 0);
class PaymentPaginateResponseDto extends (0, openapi_builder_1.DataResponse)(class PaymentPaginateResponse extends (0, openapi_builder_1.PaginateResponse)(PaymentDto) {
}) {
}
exports.PaymentPaginateResponseDto = PaymentPaginateResponseDto;
//# sourceMappingURL=payment.dto.js.map