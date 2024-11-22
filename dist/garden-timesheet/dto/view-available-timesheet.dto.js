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
exports.ViewAvailableTimeDataResponse = exports.ViewAvailableTimeResponse = exports.QueryAvailableTimeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment-timezone");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const future_min_month_validator_1 = require("../../common/validators/future-min-month.validator");
const future_max_month_validator_1 = require("../../common/validators/future-max-month.validator");
const class_transformer_1 = require("class-transformer");
const config_1 = require("../../config");
class QueryAvailableTimeDto {
}
exports.QueryAvailableTimeDto = QueryAvailableTimeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, future_min_month_validator_1.FutureMinMonth)(0),
    (0, future_max_month_validator_1.FutureMaxMonth)(3),
    (0, class_transformer_1.Transform)(({ value }) => (moment(value).tz(config_1.VN_TIMEZONE).startOf('date').toISOString())),
    __metadata("design:type", Date)
], QueryAvailableTimeDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], QueryAvailableTimeDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.Weekday, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constant_1.Weekday, { each: true }),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ArrayMaxSize)(2),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value))),
    __metadata("design:type", Array)
], QueryAvailableTimeDto.prototype, "weekdays", void 0);
class AvailableTimeOfGardens {
}
class ViewAvailableTimeResponse {
}
exports.ViewAvailableTimeResponse = ViewAvailableTimeResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.SlotNumber, isArray: true }),
    __metadata("design:type", Array)
], ViewAvailableTimeResponse.prototype, "slotNumbers", void 0);
class ViewAvailableTimeDataResponse extends (0, openapi_builder_1.DataResponse)(ViewAvailableTimeResponse) {
}
exports.ViewAvailableTimeDataResponse = ViewAvailableTimeDataResponse;
//# sourceMappingURL=view-available-timesheet.dto.js.map