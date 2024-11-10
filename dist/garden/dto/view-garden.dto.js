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
exports.GardenDetailDataResponse = exports.GardenListDataResponse = exports.QueryGardenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const base_garden_dto_1 = require("./base.garden.dto");
const constant_2 = require("../contracts/constant");
const base_garden_manager_dto_1 = require("../../garden-manager/dto/base.garden-manager.dto");
class QueryGardenDto {
}
exports.QueryGardenDto = QueryGardenDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryGardenDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], QueryGardenDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_1.GardenStatus,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryGardenDto.prototype, "status", void 0);
class GardenListItemResponse extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, constant_2.GARDEN_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: (0, swagger_1.PickType)(base_garden_manager_dto_1.BaseGardenManagerDto, ['_id', 'name']) }),
    __metadata("design:type", base_garden_manager_dto_1.BaseGardenManagerDto)
], GardenListItemResponse.prototype, "gardenManager", void 0);
class GardenListResponse extends (0, openapi_builder_1.PaginateResponse)(GardenListItemResponse) {
}
class GardenListDataResponse extends (0, openapi_builder_1.DataResponse)(GardenListResponse) {
}
exports.GardenListDataResponse = GardenListDataResponse;
class GardenDetailResponse extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, constant_2.GARDEN_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: (0, swagger_1.PickType)(base_garden_manager_dto_1.BaseGardenManagerDto, ['_id', 'name']) }),
    __metadata("design:type", base_garden_manager_dto_1.BaseGardenManagerDto)
], GardenDetailResponse.prototype, "gardenManager", void 0);
class GardenDetailDataResponse extends (0, openapi_builder_1.DataResponse)(GardenDetailResponse) {
}
exports.GardenDetailDataResponse = GardenDetailDataResponse;
//# sourceMappingURL=view-garden.dto.js.map