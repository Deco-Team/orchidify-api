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
exports.ViewSlotListDataResponse = exports.ViewSlotItemResponse = exports.QueryInactiveTimesheetByGardenDto = exports.QuerySlotByGardenIdsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const future_max_month_validator_1 = require("../../common/validators/future-max-month.validator");
const past_max_month_validator_1 = require("../../common/validators/past-max-month.validator");
const slot_dto_1 = require("./slot.dto");
const base_garden_dto_1 = require("../../garden/dto/base.garden.dto");
const base_instructor_dto_1 = require("../../instructor/dto/base.instructor.dto");
class QuerySlotByGardenIdsDto {
    constructor() {
        this.type = constant_1.TimesheetType.DAY;
    }
}
exports.QuerySlotByGardenIdsDto = QuerySlotByGardenIdsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2024-09-20' }),
    (0, future_max_month_validator_1.FutureMaxMonth)(12),
    (0, past_max_month_validator_1.PastMaxMonth)(24),
    __metadata("design:type", Date)
], QuerySlotByGardenIdsDto.prototype, "date", void 0);
class QueryInactiveTimesheetByGardenDto extends (0, swagger_1.PickType)(QuerySlotByGardenIdsDto, ['date']) {
}
exports.QueryInactiveTimesheetByGardenDto = QueryInactiveTimesheetByGardenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], QueryInactiveTimesheetByGardenDto.prototype, "gardenId", void 0);
class SLotInstructorDetailResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['name']) {
}
class SlotGardenDetailResponse extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['name']) {
}
class ViewSlotItemResponse {
}
exports.ViewSlotItemResponse = ViewSlotItemResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ViewSlotItemResponse.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, enum: constant_1.SlotNumber }),
    __metadata("design:type", Number)
], ViewSlotItemResponse.prototype, "slotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewSlotItemResponse.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewSlotItemResponse.prototype, "end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ViewSlotItemResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], ViewSlotItemResponse.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: slot_dto_1.BaseSlotMetadataDto }),
    __metadata("design:type", slot_dto_1.BaseSlotMetadataDto)
], ViewSlotItemResponse.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SLotInstructorDetailResponse }),
    __metadata("design:type", SLotInstructorDetailResponse)
], ViewSlotItemResponse.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SlotGardenDetailResponse }),
    __metadata("design:type", SlotGardenDetailResponse)
], ViewSlotItemResponse.prototype, "garden", void 0);
class ViewSlotListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ViewSlotItemResponse, isArray: true }),
    __metadata("design:type", Array)
], ViewSlotListResponse.prototype, "docs", void 0);
class ViewSlotListDataResponse extends (0, openapi_builder_1.DataResponse)(ViewSlotListResponse) {
}
exports.ViewSlotListDataResponse = ViewSlotListDataResponse;
//# sourceMappingURL=garden-manager-view-timesheet.dto.js.map