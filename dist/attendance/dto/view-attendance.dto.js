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
exports.AttendanceListDataResponse = exports.QueryAttendanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const base_attendance_dto_1 = require("./base.attendance.dto");
const base_learner_dto_1 = require("../../learner/dto/base.learner.dto");
const constant_1 = require("../contracts/constant");
const slot_dto_1 = require("../../garden-timesheet/dto/slot.dto");
class QueryAttendanceDto {
}
exports.QueryAttendanceDto = QueryAttendanceDto;
class AttendanceLearnerDetailResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, ['_id', 'name', 'avatar']) {
}
class AttendanceListItemResponse extends (0, swagger_1.PickType)(base_attendance_dto_1.BaseAttendanceDto, constant_1.ATTENDANCE_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceLearnerDetailResponse }),
    __metadata("design:type", AttendanceLearnerDetailResponse)
], AttendanceListItemResponse.prototype, "learner", void 0);
class AttendanceListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], AttendanceListResponse.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: slot_dto_1.BaseSlotDto }),
    __metadata("design:type", slot_dto_1.BaseSlotDto)
], AttendanceListResponse.prototype, "slot", void 0);
class AttendanceListDataResponse extends (0, openapi_builder_1.DataResponse)(AttendanceListResponse) {
}
exports.AttendanceListDataResponse = AttendanceListDataResponse;
//# sourceMappingURL=view-attendance.dto.js.map