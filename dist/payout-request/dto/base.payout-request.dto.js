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
exports.BasePayoutRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const payout_request_schema_1 = require("../schemas/payout-request.schema");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const class_transformer_1 = require("class-transformer");
class BasePayoutRequestDto {
}
exports.BasePayoutRequestDto = BasePayoutRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BasePayoutRequestDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(200000),
    (0, class_validator_1.Max)(50000000),
    __metadata("design:type", Number)
], BasePayoutRequestDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.PayoutRequestStatus }),
    (0, class_validator_1.IsEnum)(constant_1.PayoutRequestStatus),
    __metadata("design:type", String)
], BasePayoutRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], BasePayoutRequestDto.prototype, "rejectReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: payout_request_schema_1.PayoutRequestStatusHistory, isArray: true }),
    __metadata("design:type", Array)
], BasePayoutRequestDto.prototype, "histories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Payout Request description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BasePayoutRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BasePayoutRequestDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BasePayoutRequestDto.prototype, "handledBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BasePayoutRequestDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    __metadata("design:type", Boolean)
], BasePayoutRequestDto.prototype, "hasMadePayout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Transaction Code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BasePayoutRequestDto.prototype, "transactionCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: base_media_dto_1.BaseMediaDto }),
    (0, class_transformer_1.Type)(() => base_media_dto_1.BaseMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", base_media_dto_1.BaseMediaDto)
], BasePayoutRequestDto.prototype, "attachment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BasePayoutRequestDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BasePayoutRequestDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.payout-request.dto.js.map