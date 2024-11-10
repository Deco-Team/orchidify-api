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
exports.UpdateGardenTimesheetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment-timezone");
const base_garden_timesheet_dto_1 = require("./base.garden-timesheet.dto");
const config_1 = require("../../config");
const future_min_day_validator_1 = require("../../common/validators/future-min-day.validator");
const class_transformer_1 = require("class-transformer");
class UpdateGardenTimesheetDto extends (0, swagger_1.PickType)(base_garden_timesheet_dto_1.BaseGardenTimesheetDto, ['gardenId', 'status']) {
}
exports.UpdateGardenTimesheetDto = UpdateGardenTimesheetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, future_min_day_validator_1.FutureMinDay)(7),
    (0, class_transformer_1.Transform)(({ value }) => moment(value).tz(config_1.VN_TIMEZONE).startOf('date').toISOString()),
    __metadata("design:type", Date)
], UpdateGardenTimesheetDto.prototype, "date", void 0);
//# sourceMappingURL=update-garden-timesheet.dto.js.map