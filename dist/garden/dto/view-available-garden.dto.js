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
exports.AvailableGardenListDataResponse = exports.AvailableGardenListItemResponse = exports.QueryAvailableGardenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const base_garden_dto_1 = require("./base.garden.dto");
const future_max_month_validator_1 = require("../../common/validators/future-max-month.validator");
const mongoose_1 = require("mongoose");
class QueryAvailableGardenDto {
}
exports.QueryAvailableGardenDto = QueryAvailableGardenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, future_max_month_validator_1.FutureMaxMonth)(3),
    __metadata("design:type", Date)
], QueryAvailableGardenDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], QueryAvailableGardenDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.Weekday, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constant_1.Weekday, { each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value))),
    __metadata("design:type", Array)
], QueryAvailableGardenDto.prototype, "weekdays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.SlotNumber, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constant_1.SlotNumber, { each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(4),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(Number) : Array(value).map(Number))),
    __metadata("design:type", Array)
], QueryAvailableGardenDto.prototype, "slotNumbers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], QueryAvailableGardenDto.prototype, "instructorId", void 0);
class AvailableGardenListItemResponse extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['_id', 'name']) {
}
exports.AvailableGardenListItemResponse = AvailableGardenListItemResponse;
class AvailableGardenListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: AvailableGardenListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], AvailableGardenListResponse.prototype, "docs", void 0);
class AvailableGardenListDataResponse extends (0, openapi_builder_1.DataResponse)(AvailableGardenListResponse) {
}
exports.AvailableGardenListDataResponse = AvailableGardenListDataResponse;
//# sourceMappingURL=view-available-garden.dto.js.map