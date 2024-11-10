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
exports.InstructorCourseController = void 0;
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
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const mongoose_1 = require("mongoose");
const course_service_1 = require("../services/course.service");
const course_session_service_1 = require("../services/course-session.service");
const course_assignment_service_1 = require("../services/course-assignment.service");
const view_course_dto_1 = require("../dto/view-course.dto");
const constant_2 = require("../contracts/constant");
const view_course_session_dto_1 = require("../dto/view-course-session.dto");
const create_course_dto_1 = require("../dto/create-course.dto");
const update_course_dto_1 = require("../dto/update-course.dto");
const view_course_assignment_dto_1 = require("../dto/view-course-assignment.dto");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_3 = require("../../setting/contracts/constant");
let InstructorCourseController = class InstructorCourseController {
    constructor(courseService, courseSessionService, courseAssignmentService, settingService) {
        this.courseService = courseService;
        this.courseSessionService = courseSessionService;
        this.courseAssignmentService = courseAssignmentService;
        this.settingService = settingService;
    }
    async list(req, pagination, queryCourseDto) {
        const { _id } = _.get(req, 'user');
        return await this.courseService.listByInstructor(_id, pagination, queryCourseDto);
    }
    async getDetail(req, courseId) {
        const { _id } = _.get(req, 'user');
        const course = await this.courseService.findById(courseId, constant_2.COURSE_DETAIL_PROJECTION);
        if (!course || course.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        return course;
    }
    async getSessionDetail(req, courseId, sessionId) {
        const { _id: instructorId } = _.get(req, 'user');
        const session = await this.courseSessionService.findOneBy({ sessionId, courseId, instructorId });
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        return session;
    }
    async getAssignmentDetail(req, courseId, assignmentId) {
        const { _id: instructorId } = _.get(req, 'user');
        const assignment = await this.courseAssignmentService.findOneBy({ assignmentId, courseId, instructorId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        return assignment;
    }
    async create(req, createCourseDto) {
        if (createCourseDto.sessions.length !== 2 * createCourseDto.duration) {
            throw new app_exception_1.AppException(error_1.Errors.TOTAL_SESSIONS_OF_COURSE_INVALID);
        }
        const assignmentsCountRange = (await this.settingService.findByKey(constant_3.SettingKey.AssignmentsCountRange)).value || [
            1, 3
        ];
        const assignmentsCount = createCourseDto.sessions.filter((session) => session?.assignments?.length === 1)?.length || 0;
        if (assignmentsCount < Number(assignmentsCountRange[0]) || assignmentsCount > Number(assignmentsCountRange[1])) {
            throw new app_exception_1.AppException(error_1.Errors.TOTAL_ASSIGNMENTS_OF_COURSE_INVALID);
        }
        const { _id } = _.get(req, 'user');
        createCourseDto['status'] = constant_1.CourseStatus.DRAFT;
        createCourseDto['instructorId'] = new mongoose_1.Types.ObjectId(_id);
        createCourseDto.sessions = createCourseDto.sessions.map((session, index) => {
            return { ...session, sessionNumber: index + 1 };
        });
        const course = await this.courseService.create(createCourseDto);
        return new dto_1.IDResponse(course._id);
    }
    async update(req, courseId, updateCourseDto) {
        if (updateCourseDto.sessions.length !== 2 * updateCourseDto.duration) {
            throw new app_exception_1.AppException(error_1.Errors.TOTAL_SESSIONS_OF_COURSE_INVALID);
        }
        const assignmentsCountRange = (await this.settingService.findByKey(constant_3.SettingKey.AssignmentsCountRange)).value || [
            1, 3
        ];
        const assignmentsCount = updateCourseDto.sessions.filter((session) => session?.assignments?.length === 1)?.length || 0;
        if (assignmentsCount < Number(assignmentsCountRange[0]) || assignmentsCount > Number(assignmentsCountRange[1])) {
            throw new app_exception_1.AppException(error_1.Errors.TOTAL_ASSIGNMENTS_OF_COURSE_INVALID);
        }
        const { _id } = _.get(req, 'user');
        const course = await this.courseService.findById(courseId);
        if (!course || course.instructorId?.toString() !== _id || course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status !== constant_1.CourseStatus.DRAFT || course.isRequesting === true)
            throw new app_exception_1.AppException(error_1.Errors.CAN_NOT_UPDATE_COURSE);
        updateCourseDto.sessions = updateCourseDto.sessions.map((session, index) => {
            return { ...session, sessionNumber: index + 1 };
        });
        await this.courseService.update({
            _id: courseId
        }, updateCourseDto);
        return new dto_1.SuccessResponse(true);
    }
    async delete(req, courseId) {
        const { _id } = _.get(req, 'user');
        const course = await this.courseService.findById(courseId);
        if (!course || course.instructorId?.toString() !== _id || course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status !== constant_1.CourseStatus.DRAFT || course.isRequesting === true)
            throw new app_exception_1.AppException(error_1.Errors.CAN_NOT_DELETE_COURSE);
        await this.courseService.update({ _id: courseId }, { status: constant_1.CourseStatus.DELETED });
        return new dto_1.SuccessResponse(true);
    }
};
exports.InstructorCourseController = InstructorCourseController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.CourseListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_course_dto_1.QueryCourseDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.CourseDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Session Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_session_dto_1.ViewCourseSessionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SESSION_NOT_FOUND]),
    (0, common_1.Get)(':courseId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "getSessionDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Assignment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_assignment_dto_1.ViewCourseAssignmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.ASSIGNMENT_NOT_FOUND]),
    (0, common_1.Get)(':courseId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "getAssignmentDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create Course`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Update Course at status: [${constant_1.CourseStatus.DRAFT}]`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND, error_1.Errors.CAN_NOT_UPDATE_COURSE]),
    (0, common_1.Put)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Delete Course at status [${constant_1.CourseStatus.DRAFT}]`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND, error_1.Errors.CAN_NOT_DELETE_COURSE]),
    (0, common_1.Delete)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorCourseController.prototype, "delete", null);
exports.InstructorCourseController = InstructorCourseController = __decorate([
    (0, swagger_1.ApiTags)('Course - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(1, (0, common_1.Inject)(course_session_service_1.ICourseSessionService)),
    __param(2, (0, common_1.Inject)(course_assignment_service_1.ICourseAssignmentService)),
    __param(3, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], InstructorCourseController);
//# sourceMappingURL=instructor.course.controller.js.map