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
exports.EnrollClassDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../transaction/contracts/constant");
const class_validator_1 = require("class-validator");
class EnrollClassDto {
    constructor() {
        this.paymentMethod = constant_1.PaymentMethod.STRIPE;
    }
}
exports.EnrollClassDto = EnrollClassDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, enum: constant_1.PaymentMethod, example: constant_1.PaymentMethod.STRIPE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constant_1.PaymentMethod),
    __metadata("design:type", String)
], EnrollClassDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['captureWallet', 'payWithMethod']),
    __metadata("design:type", String)
], EnrollClassDto.prototype, "requestType", void 0);
//# sourceMappingURL=enroll-class.dto.js.map