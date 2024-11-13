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
exports.BaseGardenDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
class BaseGardenDto {
}
exports.BaseGardenDto = BaseGardenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "addressLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(8),
    __metadata("design:type", Array)
], BaseGardenDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.GardenStatus }),
    (0, class_validator_1.IsEnum)(constant_1.GardenStatus),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], BaseGardenDto.prototype, "maxClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseGardenDto.prototype, "gardenManagerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseGardenDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseGardenDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.garden.dto.js.map