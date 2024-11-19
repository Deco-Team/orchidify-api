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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorCourseComboController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const mongoose_1 = require("mongoose");
const course_service_1 = require("../services/course.service");
const create_course_combo_dto_1 = require("../dto/create-course-combo.dto");
const update_course_combo_dto_1 = require("../dto/update-course-combo.dto");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const course_combo_service_1 = require("../services/course-combo.service");
const view_course_combo_dto_1 = require("../dto/view-course-combo.dto");
const constant_2 = require("../contracts/constant");
let InstructorCourseComboController = class InstructorCourseComboController {
    constructor(courseComboService, courseService) {
        this.courseComboService = courseComboService;
        this.courseService = courseService;
    }
    async list(req, pagination, queryCourseDto) {
        const { _id } = _.get(req, 'user');
        return await this.courseComboService.listByInstructor(_id, pagination, queryCourseDto);
    }
    async getDetail(req, courseId) {
        const { _id } = _.get(req, 'user');
        const courseCombo = await this.courseComboService.findById(courseId, constant_2.COURSE_COMBO_DETAIL_PROJECTION, [
            {
                path: 'childCourses',
                select: constant_2.CHILD_COURSE_COMBO_DETAIL_PROJECTION
            }
        ]);
        if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_NOT_FOUND);
        return courseCombo;
    }
    async create(req, createCourseComboDto) {
        const { _id } = _.get(req, 'user');
        const { childCourseIds } = createCourseComboDto;
        const formatChildCourseIds = childCourseIds.map((courseId) => new mongoose_1.Types.ObjectId(courseId));
        const childCourses = await this.courseService.findMany({
            _id: {
                $in: formatChildCourseIds
            },
            instructorId: new mongoose_1.Types.ObjectId(_id),
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: { $exists: false }
        });
        if (childCourses.length !== childCourseIds.length)
            throw new app_exception_1.AppException(error_1.Errors.CHILD_COURSE_COMBO_INVALID);
        const existedCourseCombos = await this.courseComboService.findMany({
            instructorId: new mongoose_1.Types.ObjectId(_id),
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: {
                $exists: true,
                $size: childCourseIds.length,
                $all: formatChildCourseIds
            }
        });
        if (existedCourseCombos.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_EXISTED);
        createCourseComboDto['status'] = constant_1.CourseStatus.ACTIVE;
        createCourseComboDto['instructorId'] = new mongoose_1.Types.ObjectId(_id);
        createCourseComboDto['childCourseIds'] = formatChildCourseIds;
        const course = await this.courseComboService.create(createCourseComboDto);
        return new dto_1.IDResponse(course._id);
    }
    async update(req, courseId, updateCourseComboDto) {
        const { _id } = _.get(req, 'user');
        const { childCourseIds } = updateCourseComboDto;
        const formatChildCourseIds = childCourseIds.map((courseId) => new mongoose_1.Types.ObjectId(courseId));
        const courseCombo = await this.courseComboService.findById(courseId);
        if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_NOT_FOUND);
        const childCourses = await this.courseService.findMany({
            _id: {
                $in: formatChildCourseIds
            },
            instructorId: new mongoose_1.Types.ObjectId(_id),
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: { $exists: false }
        });
        if (childCourses.length !== childCourseIds.length)
            throw new app_exception_1.AppException(error_1.Errors.CHILD_COURSE_COMBO_INVALID);
        const existedCourseCombos = await this.courseComboService.findMany({
            _id: { $ne: courseCombo._id },
            instructorId: new mongoose_1.Types.ObjectId(_id),
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: {
                $all: formatChildCourseIds,
                $size: childCourseIds.length
            }
        });
        if (existedCourseCombos.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_EXISTED);
        updateCourseComboDto['childCourseIds'] = formatChildCourseIds;
        await this.courseComboService.update({
            _id: courseId
        }, updateCourseComboDto);
        return new dto_1.SuccessResponse(true);
    }
    async delete(req, courseId) {
        const { _id } = _.get(req, 'user');
        const courseCombo = await this.courseComboService.findById(courseId);
        if (!courseCombo || courseCombo.instructorId?.toString() !== _id || courseCombo.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_NOT_FOUND);
        await this.courseComboService.update({ _id: courseId }, { status: constant_1.CourseStatus.DELETED });
        return new dto_1.SuccessResponse(true);
    }
};
exports.InstructorCourseComboController = InstructorCourseComboController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Combo List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_combo_dto_1.CourseComboListDataResponse }),
    (0, common_1.Get)('combo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_course_combo_dto_1.QueryCourseComboDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseComboController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Combo Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_combo_dto_1.CourseComboDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_COMBO_NOT_FOUND]),
    (0, common_1.Get)('combo/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseComboController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create Course Combo`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CHILD_COURSE_COMBO_INVALID, error_1.Errors.COURSE_COMBO_EXISTED]),
    (0, common_1.Post)('combo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_combo_dto_1.CreateCourseComboDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseComboController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Update Course Combo`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_COMBO_NOT_FOUND, error_1.Errors.CHILD_COURSE_COMBO_INVALID, error_1.Errors.COURSE_COMBO_EXISTED]),
    (0, common_1.Put)('combo/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_course_combo_dto_1.UpdateCourseComboDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseComboController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Delete Course Combo`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_COMBO_NOT_FOUND]),
    (0, common_1.Delete)('combo/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseComboController.prototype, "delete", null);
exports.InstructorCourseComboController = InstructorCourseComboController = __decorate([
    (0, swagger_1.ApiTags)('CourseCombo - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(course_combo_service_1.ICourseComboService)),
    __param(1, (0, common_1.Inject)(course_service_1.ICourseService)),
    __metadata("design:paramtypes", [Object, Object])
], InstructorCourseComboController);
//# sourceMappingURL=instructor.course-combo.controller.js.map