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
exports.ProcessRecruitmentApplicationDto = void 0;
const future_min_day_validator_1 = require("../../common/validators/future-min-day.validator");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProcessRecruitmentApplicationDto {
}
exports.ProcessRecruitmentApplicationDto = ProcessRecruitmentApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'https://meet.google.com/' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ProcessRecruitmentApplicationDto.prototype, "meetingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, future_min_day_validator_1.FutureMinDay)(0),
    __metadata("design:type", Date)
], ProcessRecruitmentApplicationDto.prototype, "meetingDate", void 0);
//# sourceMappingURL=process-recruitment-application.dto.js.map