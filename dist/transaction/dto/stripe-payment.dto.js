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
exports.RefundStripePaymentDto = exports.StripePaymentResponseDto = exports.QueryStripePaymentDto = exports.CreateStripePaymentDataResponse = exports.CreateStripePaymentResponse = exports.CreateStripePaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const stripe_1 = require("stripe");
class CreateStripePaymentDto {
}
exports.CreateStripePaymentDto = CreateStripePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateStripePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CreateStripePaymentDto.prototype, "metadata", void 0);
class CreateStripePaymentResponse {
}
exports.CreateStripePaymentResponse = CreateStripePaymentResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentResponse.prototype, "paymentIntent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentResponse.prototype, "ephemeralKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStripePaymentResponse.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateStripePaymentResponse.prototype, "publishableKey", void 0);
class CreateStripePaymentDataResponse extends (0, openapi_builder_1.DataResponse)(CreateStripePaymentResponse) {
}
exports.CreateStripePaymentDataResponse = CreateStripePaymentDataResponse;
class QueryStripePaymentDto {
}
exports.QueryStripePaymentDto = QueryStripePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QueryStripePaymentDto.prototype, "id", void 0);
class StripePaymentResponseDto {
}
exports.StripePaymentResponseDto = StripePaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "amount", void 0);
class RefundStripePaymentDto {
}
exports.RefundStripePaymentDto = RefundStripePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RefundStripePaymentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], RefundStripePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], RefundStripePaymentDto.prototype, "metadata", void 0);
//# sourceMappingURL=stripe-payment.dto.js.map