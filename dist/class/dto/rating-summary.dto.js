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
exports.BaseRatingSummaryDto = exports.BaseRatingTotalCountByRateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BaseRatingTotalCountByRateDto {
    constructor() {
        this['1'] = 0;
        this['2'] = 0;
        this['3'] = 0;
        this['4'] = 0;
        this['5'] = 0;
    }
}
exports.BaseRatingTotalCountByRateDto = BaseRatingTotalCountByRateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingTotalCountByRateDto.prototype, 1, void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingTotalCountByRateDto.prototype, 2, void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingTotalCountByRateDto.prototype, 3, void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingTotalCountByRateDto.prototype, 4, void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingTotalCountByRateDto.prototype, 5, void 0);
class BaseRatingSummaryDto {
    constructor(totalSum, totalCount, totalCountByRate) {
        this.totalSum = totalSum;
        this.totalCount = totalCount;
        this.totalCountByRate = totalCountByRate;
    }
}
exports.BaseRatingSummaryDto = BaseRatingSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingSummaryDto.prototype, "totalSum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseRatingSummaryDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BaseRatingTotalCountByRateDto }),
    __metadata("design:type", BaseRatingTotalCountByRateDto)
], BaseRatingSummaryDto.prototype, "totalCountByRate", void 0);
//# sourceMappingURL=rating-summary.dto.js.map