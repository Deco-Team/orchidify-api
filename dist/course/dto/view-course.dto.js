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
exports.PublicCourseDetailDataResponse = exports.PublishCourseListDataResponse = exports.CourseDetailDataResponse = exports.CourseListDataResponse = exports.CourseInstructorDto = exports.PublicQueryCourseDto = exports.StaffQueryCourseDto = exports.QueryCourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_course_dto_1 = require("./base.course.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const constant_3 = require("../../common/contracts/constant");
const base_instructor_dto_1 = require("../../instructor/dto/base.instructor.dto");
const session_dto_1 = require("../../class/dto/session.dto");
const base_class_dto_1 = require("../../class/dto/base.class.dto");
const base_garden_dto_1 = require("../../garden/dto/base.garden.dto");
const constant_4 = require("../../class/contracts/constant");
const constant_5 = require("../../instructor/contracts/constant");
const base_learner_dto_1 = require("../../learner/dto/base.learner.dto");
class QueryCourseDto {
}
exports.QueryCourseDto = QueryCourseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], QueryCourseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_3.CourseLevel,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryCourseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_1.CourseStatus.DRAFT, constant_1.CourseStatus.ACTIVE],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryCourseDto.prototype, "status", void 0);
class StaffQueryCourseDto extends QueryCourseDto {
}
exports.StaffQueryCourseDto = StaffQueryCourseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_1.CourseStatus.ACTIVE],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], StaffQueryCourseDto.prototype, "status", void 0);
class PublicQueryCourseDto extends (0, swagger_1.PickType)(QueryCourseDto, ['title', 'type', 'level']) {
}
exports.PublicQueryCourseDto = PublicQueryCourseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(10000000),
    __metadata("design:type", Number)
], PublicQueryCourseDto.prototype, "fromPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(10000000),
    __metadata("design:type", Number)
], PublicQueryCourseDto.prototype, "toPrice", void 0);
class CourseInstructorDto extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_5.COURSE_INSTRUCTOR_DETAIL_PROJECTION) {
}
exports.CourseInstructorDto = CourseInstructorDto;
class CourseListItemResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_2.COURSE_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: CourseInstructorDto }),
    __metadata("design:type", CourseInstructorDto)
], CourseListItemResponse.prototype, "instructor", void 0);
class CourseListResponse extends (0, openapi_builder_1.PaginateResponse)(CourseListItemResponse) {
}
class CourseListDataResponse extends (0, openapi_builder_1.DataResponse)(CourseListResponse) {
}
exports.CourseListDataResponse = CourseListDataResponse;
class CourseDetailResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_2.COURSE_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: CourseInstructorDto }),
    __metadata("design:type", CourseInstructorDto)
], CourseDetailResponse.prototype, "instructor", void 0);
class CourseDetailDataResponse extends (0, openapi_builder_1.DataResponse)(CourseDetailResponse) {
}
exports.CourseDetailDataResponse = CourseDetailDataResponse;
class PublicCourseListItemResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_2.COURSE_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: CourseInstructorDto }),
    __metadata("design:type", CourseInstructorDto)
], PublicCourseListItemResponse.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], PublicCourseListItemResponse.prototype, "classesCount", void 0);
class PublicCourseListResponse extends (0, openapi_builder_1.PaginateResponse)(PublicCourseListItemResponse) {
}
class PublishCourseListDataResponse extends (0, openapi_builder_1.DataResponse)(PublicCourseListResponse) {
}
exports.PublishCourseListDataResponse = PublishCourseListDataResponse;
class PublicCourseClassGardenDto extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['_id', 'name']) {
}
class PublicCourseSessionDto extends (0, swagger_1.PickType)(session_dto_1.BaseSessionDto, ['_id', 'title']) {
}
class PublicCourseLearnerClassDto extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, ['_id']) {
}
class PublicCourseClassDto extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_4.PUBLIC_COURSE_CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: PublicCourseClassGardenDto }),
    __metadata("design:type", PublicCourseClassGardenDto)
], PublicCourseClassDto.prototype, "garden", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PublicCourseLearnerClassDto }),
    __metadata("design:type", PublicCourseLearnerClassDto)
], PublicCourseClassDto.prototype, "learnerClass", void 0);
class PublicCourseDetailResponse extends (0, swagger_1.PickType)(base_course_dto_1.BaseCourseDto, constant_2.COURSE_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: CourseInstructorDto }),
    __metadata("design:type", CourseInstructorDto)
], PublicCourseDetailResponse.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PublicCourseSessionDto, isArray: true }),
    __metadata("design:type", Array)
], PublicCourseDetailResponse.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PublicCourseClassDto, isArray: true }),
    __metadata("design:type", PublicCourseClassDto)
], PublicCourseDetailResponse.prototype, "classes", void 0);
class PublicCourseDetailDataResponse extends (0, openapi_builder_1.DataResponse)(PublicCourseDetailResponse) {
}
exports.PublicCourseDetailDataResponse = PublicCourseDetailDataResponse;
//# sourceMappingURL=view-course.dto.js.map