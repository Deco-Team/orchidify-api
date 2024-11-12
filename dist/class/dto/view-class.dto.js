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
exports.LearnerViewMyClassDetailDataResponse = exports.LearnerViewMyClassListDataResponse = exports.GardenManagerViewClassDetailDataResponse = exports.StaffViewClassDetailDataResponse = exports.StaffViewClassListDataResponse = exports.InstructorViewClassDetailDataResponse = exports.InstructorViewClassListDataResponse = exports.ClassCourseDetailResponse = exports.ClassGardenDetailResponse = exports.QueryClassDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_class_dto_1 = require("./base.class.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const class_validator_1 = require("class-validator");
const constant_1 = require("../../common/contracts/constant");
const class_transformer_1 = require("class-transformer");
const constant_2 = require("../contracts/constant");
const base_garden_dto_1 = require("../../garden/dto/base.garden.dto");
const base_instructor_dto_1 = require("../../instructor/dto/base.instructor.dto");
const view_learner_dto_1 = require("../../learner/dto/view-learner.dto");
const constant_3 = require("../../instructor/contracts/constant");
class QueryClassDto {
}
exports.QueryClassDto = QueryClassDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryClassDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type to search'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], QueryClassDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: constant_1.CourseLevel,
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryClassDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [constant_1.ClassStatus.PUBLISHED, constant_1.ClassStatus.IN_PROGRESS, constant_1.ClassStatus.COMPLETED, constant_1.ClassStatus.CANCELED],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : Array(value))),
    __metadata("design:type", Array)
], QueryClassDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(10000000),
    __metadata("design:type", Number)
], QueryClassDto.prototype, "fromPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(10000000),
    __metadata("design:type", Number)
], QueryClassDto.prototype, "toPrice", void 0);
class ClassInstructorDetailResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['name']) {
}
class ClassGardenDetailResponse extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['name']) {
}
exports.ClassGardenDetailResponse = ClassGardenDetailResponse;
class ClassCourseDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, ['code']) {
}
exports.ClassCourseDetailResponse = ClassCourseDetailResponse;
class InstructorViewClassListItemResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.CLASS_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassCourseDetailResponse }),
    __metadata("design:type", ClassCourseDetailResponse)
], InstructorViewClassListItemResponse.prototype, "course", void 0);
class InstructorViewClassListResponse extends (0, openapi_builder_1.PaginateResponse)(InstructorViewClassListItemResponse) {
}
class InstructorViewClassListDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewClassListResponse) {
}
exports.InstructorViewClassListDataResponse = InstructorViewClassListDataResponse;
class InstructorViewClassDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassGardenDetailResponse }),
    __metadata("design:type", ClassGardenDetailResponse)
], InstructorViewClassDetailResponse.prototype, "garden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassCourseDetailResponse }),
    __metadata("design:type", ClassCourseDetailResponse)
], InstructorViewClassDetailResponse.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: view_learner_dto_1.LearnerDetailResponse, isArray: true }),
    __metadata("design:type", Array)
], InstructorViewClassDetailResponse.prototype, "learners", void 0);
class InstructorViewClassDetailDataResponse extends (0, openapi_builder_1.DataResponse)(InstructorViewClassDetailResponse) {
}
exports.InstructorViewClassDetailDataResponse = InstructorViewClassDetailDataResponse;
class StaffViewClassListItemResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.CLASS_LIST_PROJECTION) {
}
class StaffViewClassListResponse extends (0, openapi_builder_1.PaginateResponse)(StaffViewClassListItemResponse) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassCourseDetailResponse }),
    __metadata("design:type", ClassCourseDetailResponse)
], StaffViewClassListResponse.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassInstructorDetailResponse }),
    __metadata("design:type", ClassInstructorDetailResponse)
], StaffViewClassListResponse.prototype, "instructor", void 0);
class StaffViewClassListDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewClassListResponse) {
}
exports.StaffViewClassListDataResponse = StaffViewClassListDataResponse;
class StaffViewClassDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassGardenDetailResponse }),
    __metadata("design:type", ClassGardenDetailResponse)
], StaffViewClassDetailResponse.prototype, "garden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassInstructorDetailResponse }),
    __metadata("design:type", ClassInstructorDetailResponse)
], StaffViewClassDetailResponse.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassCourseDetailResponse }),
    __metadata("design:type", ClassCourseDetailResponse)
], StaffViewClassDetailResponse.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: view_learner_dto_1.LearnerDetailResponse, isArray: true }),
    __metadata("design:type", Array)
], StaffViewClassDetailResponse.prototype, "learners", void 0);
class StaffViewClassDetailDataResponse extends (0, openapi_builder_1.DataResponse)(StaffViewClassDetailResponse) {
}
exports.StaffViewClassDetailDataResponse = StaffViewClassDetailDataResponse;
class GardenManagerViewClassDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassInstructorDetailResponse }),
    __metadata("design:type", ClassInstructorDetailResponse)
], GardenManagerViewClassDetailResponse.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassCourseDetailResponse }),
    __metadata("design:type", ClassCourseDetailResponse)
], GardenManagerViewClassDetailResponse.prototype, "course", void 0);
class GardenManagerViewClassDetailDataResponse extends (0, openapi_builder_1.DataResponse)(GardenManagerViewClassDetailResponse) {
}
exports.GardenManagerViewClassDetailDataResponse = GardenManagerViewClassDetailDataResponse;
class LearnerViewMyClassListItemResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.LEARNER_VIEW_MY_CLASS_LIST_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassInstructorDetailResponse }),
    __metadata("design:type", ClassInstructorDetailResponse)
], LearnerViewMyClassListItemResponse.prototype, "instructor", void 0);
class LearnerViewMyClassListResponse extends (0, openapi_builder_1.PaginateResponse)(LearnerViewMyClassListItemResponse) {
}
class LearnerViewMyClassListDataResponse extends (0, openapi_builder_1.DataResponse)(LearnerViewMyClassListResponse) {
}
exports.LearnerViewMyClassListDataResponse = LearnerViewMyClassListDataResponse;
class MyClassInstructorDetailResponse extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, constant_3.MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION) {
}
class LearnerViewMyClassDetailResponse extends (0, swagger_1.PickType)(base_class_dto_1.BaseClassDto, constant_2.LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassGardenDetailResponse }),
    __metadata("design:type", ClassGardenDetailResponse)
], LearnerViewMyClassDetailResponse.prototype, "garden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MyClassInstructorDetailResponse }),
    __metadata("design:type", MyClassInstructorDetailResponse)
], LearnerViewMyClassDetailResponse.prototype, "instructor", void 0);
class LearnerViewMyClassDetailDataResponse extends (0, openapi_builder_1.DataResponse)(LearnerViewMyClassDetailResponse) {
}
exports.LearnerViewMyClassDetailDataResponse = LearnerViewMyClassDetailDataResponse;
//# sourceMappingURL=view-class.dto.js.map