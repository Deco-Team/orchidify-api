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
exports.ViewMyTimesheetListDataResponse = exports.ViewMyTimesheetItemResponse = exports.QueryMyTimesheetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const future_max_month_validator_1 = require("../../common/validators/future-max-month.validator");
const past_max_month_validator_1 = require("../../common/validators/past-max-month.validator");
const slot_dto_1 = require("./slot.dto");
class QueryMyTimesheetDto {
}
exports.QueryMyTimesheetDto = QueryMyTimesheetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2024-09-20' }),
    (0, future_max_month_validator_1.FutureMaxMonth)(12),
    (0, past_max_month_validator_1.PastMaxMonth)(24),
    __metadata("design:type", Date)
], QueryMyTimesheetDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.TimesheetType }),
    (0, class_validator_1.IsEnum)(constant_1.TimesheetType),
    __metadata("design:type", String)
], QueryMyTimesheetDto.prototype, "type", void 0);
class ViewMyTimesheetItemResponse {
}
exports.ViewMyTimesheetItemResponse = ViewMyTimesheetItemResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ViewMyTimesheetItemResponse.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, enum: constant_1.SlotNumber }),
    __metadata("design:type", Number)
], ViewMyTimesheetItemResponse.prototype, "slotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewMyTimesheetItemResponse.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewMyTimesheetItemResponse.prototype, "end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ViewMyTimesheetItemResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], ViewMyTimesheetItemResponse.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: slot_dto_1.BaseSlotMetadataDto }),
    __metadata("design:type", slot_dto_1.BaseSlotMetadataDto)
], ViewMyTimesheetItemResponse.prototype, "metadata", void 0);
class ViewMyTimesheetListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ViewMyTimesheetItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ViewMyTimesheetListResponse.prototype, "docs", void 0);
class ViewMyTimesheetListDataResponse extends (0, openapi_builder_1.DataResponse)(ViewMyTimesheetListResponse) {
}
exports.ViewMyTimesheetListDataResponse = ViewMyTimesheetListDataResponse;
//# sourceMappingURL=view-my-timesheet.dto.js.map