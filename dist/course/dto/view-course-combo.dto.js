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
exports.StaffViewCourseComboDetailDataResponse = exports.StaffViewCourseComboListDataResponse = exports.CourseComboDetailDataResponse = exports.CourseComboListDataResponse = exports.StaffQueryCourseComboDto = exports.QueryCourseComboDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_course_dto_1 = require("./base.course.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../contracts/constant");
const view_course_dto_1 = require("./view-course.dto");
class QueryCourseComboDto {
}
exports.QueryCourseComboDto = QueryCourseComboDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryCourseComboDto.prototype, "title", void 0);
class StaffQueryCourseComboDto extends QueryCourseComboDto {
}
exports.StaffQueryCourseComboDto = StaffQueryCourseComboDto;
class CourseComboListItemResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_1.COURSE_COMBO_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: view_course_dto_1.CourseInstructorDto }),
    __metadata("design:type", view_course_dto_1.CourseInstructorDto)
], CourseComboListItemResponse.prototype, "instructor", void 0);
class CourseComboListResponse extends (0, openapi_builder_1.PaginateResponse)(CourseComboListItemResponse) {
}
class CourseComboListDataResponse extends (0, openapi_builder_1.DataResponse)(CourseComboListResponse) {
}
exports.CourseComboListDataResponse = CourseComboListDataResponse;
class ChildCourseComboDetailResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_1.CHILD_COURSE_COMBO_DETAIL_PROJECTION) {
}
class CourseComboDetailResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_1.COURSE_COMBO_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChildCourseComboDetailResponse, isArray: true }),
    __metadata("design:type", Array)
], CourseComboDetailResponse.prototype, "childCourses", void 0);
class CourseComboDetailDataResponse extends (0, openapi_builder_1.DataResponse)(CourseComboDetailResponse) {
}
exports.CourseComboDetailDataResponse = CourseComboDetailDataResponse;
class StaffViewCourseComboListItemResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_1.COURSE_COMBO_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: view_course_dto_1.CourseInstructorDto }),
    __metadata("design:type", view_course_dto_1.CourseInstructorDto)
], StaffViewCourseComboListItemResponse.prototype, "instructor", void 0);
class StaffViewCourseComboListResponse extends (0, openapi_builder_1.PaginateResponse)(StaffViewCourseComboListItemResponse) {
}
class StaffViewCourseComboListDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewCourseComboListResponse) {
}
exports.StaffViewCourseComboListDataResponse = StaffViewCourseComboListDataResponse;
class StaffViewCourseComboDetailResponse extends CourseComboDetailResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: view_course_dto_1.CourseInstructorDto }),
    __metadata("design:type", view_course_dto_1.CourseInstructorDto)
], StaffViewCourseComboDetailResponse.prototype, "instructor", void 0);
class StaffViewCourseComboDetailDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewCourseComboDetailResponse) {
}
exports.StaffViewCourseComboDetailDataResponse = StaffViewCourseComboDetailDataResponse;
//# sourceMappingURL=view-course-combo.dto.js.map