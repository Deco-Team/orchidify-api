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
exports.TransactionDetailDataResponse = exports.TransactionListDataResponse = exports.QueryTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_transaction_dto_1 = require("./base.transaction.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
class QueryTransactionDto {
}
exports.QueryTransactionDto = QueryTransactionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_2.TransactionType,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_2.PaymentMethod.STRIPE, constant_2.PaymentMethod.MOMO],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryTransactionDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_1.TransactionStatus.CAPTURED, constant_1.TransactionStatus.ERROR, constant_1.TransactionStatus.CANCELED, constant_1.TransactionStatus.REFUNDED],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryTransactionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(config_1.MIN_PRICE),
    (0, class_validator_1.Max)(50000000),
    __metadata("design:type", Number)
], QueryTransactionDto.prototype, "fromAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(config_1.MIN_PRICE),
    (0, class_validator_1.Max)(50000000),
    __metadata("design:type", Number)
], QueryTransactionDto.prototype, "toAmount", void 0);
class TransactionListItemResponse extends (0, swagger_1.PickType)(base_transaction_dto_1.BaseTransactionDto, constant_2.TRANSACTION_LIST_PROJECTION) {
}
class TransactionListResponse extends (0, openapi_builder_1.PaginateResponse)(TransactionListItemResponse) {
}
class TransactionListDataResponse extends (0, openapi_builder_1.DataResponse)(TransactionListResponse) {
}
exports.TransactionListDataResponse = TransactionListDataResponse;
class TransactionDetailResponse extends (0, swagger_1.PickType)(base_transaction_dto_1.BaseTransactionDto, constant_2.TRANSACTION_DETAIL_PROJECTION) {
}
class TransactionDetailDataResponse extends (0, openapi_builder_1.DataResponse)(TransactionDetailResponse) {
}
exports.TransactionDetailDataResponse = TransactionDetailDataResponse;
//# sourceMappingURL=view-transaction.dto.js.map