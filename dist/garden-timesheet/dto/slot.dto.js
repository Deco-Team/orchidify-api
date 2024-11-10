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
exports.ViewSlotDto = exports.CreateSlotDto = exports.BaseSlotDto = exports.BaseSlotMetadataDto = void 0;
const class_validator_1 = require("class-validator");
const moment = require("moment-timezone");
const swagger_1 = require("@nestjs/swagger");
const constant_1 = require("../../common/contracts/constant");
const config_1 = require("../../config");
const base_class_dto_1 = require("../../class/dto/base.class.dto");
const view_class_dto_1 = require("../../class/dto/view-class.dto");
const constant_2 = require("../contracts/constant");
class BaseSlotMetadataDto extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, ['code', 'title']) {
}
exports.BaseSlotMetadataDto = BaseSlotMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseSlotMetadataDto.prototype, "sessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Session title' }),
    __metadata("design:type", String)
], BaseSlotMetadataDto.prototype, "sessionTitle", void 0);
class BaseSlotDto {
}
exports.BaseSlotDto = BaseSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseSlotDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.SlotNumber }),
    __metadata("design:type", Number)
], BaseSlotDto.prototype, "slotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], BaseSlotDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], BaseSlotDto.prototype, "end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constant_1.SlotStatus }),
    __metadata("design:type", String)
], BaseSlotDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", Object)
], BaseSlotDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", Object)
], BaseSlotDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", Object)
], BaseSlotDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BaseSlotMetadataDto }),
    __metadata("design:type", BaseSlotMetadataDto)
], BaseSlotDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    __metadata("design:type", Boolean)
], BaseSlotDto.prototype, "hasTakenAttendance", void 0);
class CreateSlotDto extends (0, swagger_1.PickType)(BaseSlotDto, [
    'slotNumber',
    'start',
    'end',
    'status',
    'instructorId',
    'sessionId',
    'classId',
    'metadata'
]) {
    constructor(slotNumber, date, instructorId, sessionId, classId, metadata) {
        const startOfDate = moment(date).tz(config_1.VN_TIMEZONE).startOf('day');
        super();
        this.slotNumber = slotNumber;
        this.status = constant_1.SlotStatus.NOT_AVAILABLE;
        this.instructorId = instructorId;
        this.sessionId = sessionId;
        this.classId = classId;
        this.metadata = metadata;
        switch (slotNumber) {
            case constant_1.SlotNumber.ONE:
                this.start = startOfDate.clone().add(7, 'hour').toDate();
                this.end = startOfDate.clone().add(9, 'hour').toDate();
                break;
            case constant_1.SlotNumber.TWO:
                this.start = startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate();
                this.end = startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate();
                break;
            case constant_1.SlotNumber.THREE:
                this.start = startOfDate.clone().add(13, 'hour').toDate();
                this.end = startOfDate.clone().add(15, 'hour').toDate();
                break;
            case constant_1.SlotNumber.FOUR:
                this.start = startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate();
                this.end = startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate();
                break;
        }
    }
}
exports.CreateSlotDto = CreateSlotDto;
class SlotClassDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.SLOT_CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: view_class_dto_1.ClassCourseDetailResponse }),
    __metadata("design:type", view_class_dto_1.ClassCourseDetailResponse)
], SlotClassDetailResponse.prototype, "course", void 0);
class ViewSlotDto extends BaseSlotDto {
}
exports.ViewSlotDto = ViewSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: view_class_dto_1.ClassGardenDetailResponse }),
    __metadata("design:type", view_class_dto_1.ClassGardenDetailResponse)
], ViewSlotDto.prototype, "garden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SlotClassDetailResponse }),
    __metadata("design:type", SlotClassDetailResponse)
], ViewSlotDto.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewSlotDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ViewSlotDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=slot.dto.js.map