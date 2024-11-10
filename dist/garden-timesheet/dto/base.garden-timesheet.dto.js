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
exports.BaseGardenTimesheetDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const slot_dto_1 = require("./slot.dto");
class BaseGardenTimesheetDto {
}
exports.BaseGardenTimesheetDto = BaseGardenTimesheetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseGardenTimesheetDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2024-12-12' }),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], BaseGardenTimesheetDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: constant_1.GardenTimesheetStatus }),
    (0, class_validator_1.IsEnum)(constant_1.GardenTimesheetStatus),
    __metadata("design:type", String)
], BaseGardenTimesheetDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], BaseGardenTimesheetDto.prototype, "gardenId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: slot_dto_1.BaseSlotDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => slot_dto_1.BaseSlotDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseGardenTimesheetDto.prototype, "slots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseGardenTimesheetDto.prototype, "gardenMaxClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseGardenTimesheetDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], BaseGardenTimesheetDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.garden-timesheet.dto.js.map