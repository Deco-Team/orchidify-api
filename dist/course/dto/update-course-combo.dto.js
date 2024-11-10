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
exports.UpdateCourseComboDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_course_dto_1 = require("./base.course.dto");
const class_validator_1 = require("class-validator");
class UpdateCourseComboDto extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, ['discount', 'childCourseIds']) {
}
exports.UpdateCourseComboDto = UpdateCourseComboDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Course Combo title' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCourseComboDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Course Combo description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCourseComboDto.prototype, "description", void 0);
//# sourceMappingURL=update-course-combo.dto.js.map