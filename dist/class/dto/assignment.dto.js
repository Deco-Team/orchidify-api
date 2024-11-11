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
exports.UpdateAssignmentDto = exports.CreateAssignmentDto = exports.BaseAssignmentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const config_1 = require("../../config");
const moment = require("moment-timezone");
class BaseAssignmentDto {
}
exports.BaseAssignmentDto = BaseAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseAssignmentDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Assignment title' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseAssignmentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Assignment description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseAssignmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: base_media_dto_1.BaseMediaDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1),
    (0, class_transformer_1.Type)(() => base_media_dto_1.BaseMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseAssignmentDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BaseAssignmentDto.prototype, "deadline", void 0);
class CreateAssignmentDto extends (0, swagger_1.PickType)(BaseAssignmentDto, ['title', 'description', 'attachments']) {
}
exports.CreateAssignmentDto = CreateAssignmentDto;
class UpdateAssignmentDto {
}
exports.UpdateAssignmentDto = UpdateAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => (moment(value).tz(config_1.VN_TIMEZONE).endOf('date').toISOString())),
    __metadata("design:type", Date)
], UpdateAssignmentDto.prototype, "deadline", void 0);
//# sourceMappingURL=assignment.dto.js.map