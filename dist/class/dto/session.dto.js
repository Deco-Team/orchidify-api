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
exports.UploadSessionResourcesDto = exports.UpdateSessionDto = exports.CreateSessionDto = exports.BaseSessionDto = exports.SessionMediaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const constant_1 = require("../../media/contracts/constant");
const array_media_max_size_validator_1 = require("../../common/validators/array-media-max-size.validator");
const assignment_dto_1 = require("./assignment.dto");
class SessionMediaDto extends base_media_dto_1.BaseMediaDto {
}
exports.SessionMediaDto = SessionMediaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SessionMediaDto.prototype, "isAddedLater", void 0);
class BaseSessionDto {
}
exports.BaseSessionDto = BaseSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BaseSessionDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], BaseSessionDto.prototype, "sessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Session title' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseSessionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Session description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseSessionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SessionMediaDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(1, constant_1.MediaResourceType.video),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(10, constant_1.MediaResourceType.image),
    (0, class_transformer_1.Type)(() => SessionMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseSessionDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: assignment_dto_1.BaseAssignmentDto, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(1),
    (0, class_transformer_1.Type)(() => assignment_dto_1.BaseAssignmentDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], BaseSessionDto.prototype, "assignments", void 0);
class CreateSessionDto extends (0, swagger_1.PickType)(BaseSessionDto, ['title', 'description']) {
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: base_media_dto_1.BaseMediaDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(1, constant_1.MediaResourceType.video),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(10, constant_1.MediaResourceType.image),
    (0, class_transformer_1.Type)(() => base_media_dto_1.BaseMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], CreateSessionDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: assignment_dto_1.CreateAssignmentDto, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(1),
    (0, class_transformer_1.Type)(() => assignment_dto_1.CreateAssignmentDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], CreateSessionDto.prototype, "assignments", void 0);
class UpdateSessionDto extends CreateSessionDto {
}
exports.UpdateSessionDto = UpdateSessionDto;
class UploadSessionResourcesDto {
}
exports.UploadSessionResourcesDto = UploadSessionResourcesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SessionMediaDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(1, constant_1.MediaResourceType.video),
    (0, array_media_max_size_validator_1.ArrayMediaMaxSize)(2, constant_1.MediaResourceType.image),
    (0, class_transformer_1.Type)(() => SessionMediaDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], UploadSessionResourcesDto.prototype, "media", void 0);
//# sourceMappingURL=session.dto.js.map