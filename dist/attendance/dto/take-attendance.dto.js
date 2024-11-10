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
exports.TakeMultipleAttendanceDto = exports.TakeAttendanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_attendance_dto_1 = require("./base.attendance.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
class TakeAttendanceDto extends (0, swagger_1.PickType)(base_attendance_dto_1.BaseAttendanceDto, ['status', 'note', 'learnerId']) {
}
exports.TakeAttendanceDto = TakeAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, enum: [constant_1.AttendanceStatus.ABSENT, constant_1.AttendanceStatus.PRESENT] }),
    (0, class_validator_1.IsEnum)([constant_1.AttendanceStatus.ABSENT, constant_1.AttendanceStatus.PRESENT]),
    __metadata("design:type", String)
], TakeAttendanceDto.prototype, "status", void 0);
class TakeMultipleAttendanceDto {
}
exports.TakeMultipleAttendanceDto = TakeMultipleAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: TakeAttendanceDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(30),
    (0, class_transformer_1.Type)(() => TakeAttendanceDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], TakeMultipleAttendanceDto.prototype, "attendances", void 0);
//# sourceMappingURL=take-attendance.dto.js.map