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
exports.UpdateCourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_course_dto_1 = require("./base.course.dto");
const session_dto_1 = require("../../class/dto/session.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateCourseDto extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, [
    'title',
    'description',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'learnerLimit',
    'gardenRequiredToolkits'
]) {
}
exports.UpdateCourseDto = UpdateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: session_dto_1.UpdateSessionDto, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ArrayMaxSize)(24),
    (0, class_transformer_1.Type)(() => session_dto_1.UpdateSessionDto),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], UpdateCourseDto.prototype, "sessions", void 0);
//# sourceMappingURL=update-course.dto.js.map