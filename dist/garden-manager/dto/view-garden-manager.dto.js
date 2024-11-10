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
exports.GardenManagerDetailDataResponse = exports.GardenManagerListDataResponse = exports.QueryGardenManagerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_garden_manager_dto_1 = require("./base.garden-manager.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
const class_validator_1 = require("class-validator");
const constant_2 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const base_garden_dto_1 = require("../../garden/dto/base.garden.dto");
class QueryGardenManagerDto {
}
exports.QueryGardenManagerDto = QueryGardenManagerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryGardenManagerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryGardenManagerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_2.GardenManagerStatus,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryGardenManagerDto.prototype, "status", void 0);
class GardenManagerDetailResponse extends (0, swagger_1.PickType)(base_garden_manager_dto_1.BaseGardenManagerDto, constant_1.GARDEN_MANAGER_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['_id', 'name']), isArray: true }),
    __metadata("design:type", Array)
], GardenManagerDetailResponse.prototype, "gardens", void 0);
class GardenManagerListResponse extends (0, openapi_builder_1.PaginateResponse)(GardenManagerDetailResponse) {
}
class GardenManagerListDataResponse extends (0, openapi_builder_1.DataResponse)(GardenManagerListResponse) {
}
exports.GardenManagerListDataResponse = GardenManagerListDataResponse;
class GardenManagerDetailDataResponse extends (0, openapi_builder_1.DataResponse)(GardenManagerDetailResponse) {
}
exports.GardenManagerDetailDataResponse = GardenManagerDetailDataResponse;
//# sourceMappingURL=view-garden-manager.dto.js.map