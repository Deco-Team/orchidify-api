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
exports.CreatePublishClassRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment-timezone");
const base_class_request_dto_1 = require("./base.class-request.dto");
const constant_1 = require("../../common/contracts/constant");
const class_validator_1 = require("class-validator");
const future_max_month_validator_1 = require("../../common/validators/future-max-month.validator");
const future_min_month_validator_1 = require("../../common/validators/future-min-month.validator");
const class_transformer_1 = require("class-transformer");
const config_1 = require("../../config");
class CreatePublishClassRequestDto extends (0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, ['description', 'courseId']) {
}
exports.CreatePublishClassRequestDto = CreatePublishClassRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, future_min_month_validator_1.FutureMinMonth)(1),
    (0, future_max_month_validator_1.FutureMaxMonth)(3),
    (0, class_transformer_1.Transform)(({ value }) => (moment(value).tz(config_1.VN_TIMEZONE).startOf('date').toISOString())),
    __metadata("design:type", Date)
], CreatePublishClassRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.Weekday, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ArrayMaxSize)(2),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? [...new Set(value)] : Array(value))),
    __metadata("design:type", Array)
], CreatePublishClassRequestDto.prototype, "weekdays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.SlotNumber, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(1),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(Number) : Array(value).map(Number))),
    __metadata("design:type", Array)
], CreatePublishClassRequestDto.prototype, "slotNumbers", void 0);
//# sourceMappingURL=create-publish-class-request.dto.js.map