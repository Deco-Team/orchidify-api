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
exports.ManagementCourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const course_service_1 = require("../services/course.service");
const course_session_service_1 = require("../services/course-session.service");
const course_assignment_service_1 = require("../services/course-assignment.service");
const view_course_dto_1 = require("../dto/view-course.dto");
const constant_2 = require("../contracts/constant");
const view_course_session_dto_1 = require("../dto/view-course-session.dto");
const view_course_assignment_dto_1 = require("../dto/view-course-assignment.dto");
const constant_3 = require("../../instructor/contracts/constant");
let ManagementCourseController = class ManagementCourseController {
    constructor(courseService, courseSessionService, courseAssignmentService) {
        this.courseService = courseService;
        this.courseSessionService = courseSessionService;
        this.courseAssignmentService = courseAssignmentService;
    }
    async list(pagination, queryCourseDto) {
        return await this.courseService.listByStaff(pagination, queryCourseDto);
    }
    async getDetail(courseId) {
        const course = await this.courseService.findById(courseId, constant_2.COURSE_DETAIL_PROJECTION, [
            {
                path: 'instructor',
                select: constant_3.PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION
            }
        ]);
        if (!course || [constant_1.CourseStatus.ACTIVE].includes(course.status) === false)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        return course;
    }
    async getSessionDetail(courseId, sessionId) {
        const session = await this.courseSessionService.findOneBy({ sessionId, courseId });
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        return session;
    }
    async getAssignmentDetail(courseId, assignmentId) {
        const assignment = await this.courseAssignmentService.findOneBy({ assignmentId, courseId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        return assignment;
    }
};
exports.ManagementCourseController = ManagementCourseController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.CourseListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_course_dto_1.StaffQueryCourseDto]),
    __metadata("design:returntype", Promise)
], ManagementCourseController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.CourseDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementCourseController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course Session Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_session_dto_1.ViewCourseSessionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SESSION_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':courseId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ManagementCourseController.prototype, "getSessionDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course Assignment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_assignment_dto_1.ViewCourseAssignmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.ASSIGNMENT_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':courseId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ManagementCourseController.prototype, "getAssignmentDetail", null);
exports.ManagementCourseController = ManagementCourseController = __decorate([
    (0, swagger_1.ApiTags)('Course - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(1, (0, common_1.Inject)(course_session_service_1.ICourseSessionService)),
    __param(2, (0, common_1.Inject)(course_assignment_service_1.ICourseAssignmentService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ManagementCourseController);
//# sourceMappingURL=management.course.controller.js.map