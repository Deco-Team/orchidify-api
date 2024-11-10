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
exports.ManagementClassController = void 0;
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
const class_service_1 = require("../services/class.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const view_class_dto_1 = require("../dto/view-class.dto");
const constant_2 = require("../contracts/constant");
const assignment_service_1 = require("../services/assignment.service");
const view_assignment_dto_1 = require("../dto/view-assignment.dto");
const session_service_1 = require("../services/session.service");
const view_session_dto_1 = require("../dto/view-session.dto");
const mongoose_1 = require("mongoose");
const learner_class_service_1 = require("../services/learner-class.service");
const config_1 = require("../../config");
const moment = require("moment-timezone");
const cancel_class_dto_1 = require("../dto/cancel-class.dto");
let ManagementClassController = class ManagementClassController {
    constructor(classService, sessionService, assignmentService, learnerClassService) {
        this.classService = classService;
        this.sessionService = sessionService;
        this.assignmentService = assignmentService;
        this.learnerClassService = learnerClassService;
    }
    async list(pagination, queryClassDto) {
        return await this.classService.listByStaff(pagination, queryClassDto);
    }
    async getDetail(classId) {
        const [courseClass, learnerClass] = await Promise.all([
            this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION, [
                {
                    path: 'garden',
                    select: ['name']
                },
                {
                    path: 'instructor',
                    select: ['name']
                },
                {
                    path: 'course',
                    select: ['code']
                }
            ]),
            this.learnerClassService.findMany({ classId: new mongoose_1.Types.ObjectId(classId) }, undefined, [{ path: 'learner' }])
        ]);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        return { ...courseClass.toJSON(), learners: learnerClass?.map((learnerClass) => learnerClass?.['learner']) };
    }
    async getLessonDetail(classId, sessionId) {
        const session = await this.sessionService.findOneBy({ sessionId, classId });
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        return session;
    }
    async getAssignmentDetail(classId, assignmentId) {
        const assignment = await this.assignmentService.findOneBy({ assignmentId, classId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        return assignment;
    }
    async getClassToolkitRequirements(classId) {
        const courseClass = await this.classService.findById(classId, constant_2.GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION, [
            {
                path: 'instructor',
                select: ['name']
            },
            {
                path: 'course',
                select: ['code']
            }
        ]);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        return courseClass;
    }
    async completeClass(req, classId) {
        const courseClass = await this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        if (courseClass.status !== constant_1.ClassStatus.IN_PROGRESS)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_STATUS_INVALID);
        const { startDate, duration, weekdays, slotNumbers } = courseClass;
        const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays, slotNumbers });
        if (moment().tz(config_1.VN_TIMEZONE).isBefore(classEndTime))
            throw new app_exception_1.AppException(error_1.Errors.CLASS_END_TIME_INVALID);
        const user = _.get(req, 'user');
        await this.classService.completeClass(classId, user);
        return new dto_1.SuccessResponse(true);
    }
    async cancelClass(req, classId, cancelClassDto) {
        const courseClass = await this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        if ([constant_1.ClassStatus.PUBLISHED, constant_1.ClassStatus.IN_PROGRESS].includes(courseClass.status) === false)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_STATUS_INVALID);
        const user = _.get(req, 'user');
        await this.classService.cancelClass(classId, cancelClassDto, user);
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementClassController = ManagementClassController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Class List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.StaffViewClassListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_class_dto_1.QueryClassDto]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Class Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.StaffViewClassDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Session Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_session_dto_1.ViewSessionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SESSION_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "getLessonDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Assignment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_assignment_dto_1.ViewAssignmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.ASSIGNMENT_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "getAssignmentDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.GARDEN_MANAGER}] View Class Toolkit Requirements `
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.GardenManagerViewClassDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.GARDEN_MANAGER),
    (0, common_1.Get)(':id([0-9a-f]{24})/gardenRequiredToolkits'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "getClassToolkitRequirements", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Complete Class`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND, error_1.Errors.CLASS_STATUS_INVALID, error_1.Errors.CLASS_END_TIME_INVALID]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/complete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "completeClass", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Cancel Class`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND, error_1.Errors.CLASS_STATUS_INVALID]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/cancel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cancel_class_dto_1.CancelClassDto]),
    __metadata("design:returntype", Promise)
], ManagementClassController.prototype, "cancelClass", null);
exports.ManagementClassController = ManagementClassController = __decorate([
    (0, swagger_1.ApiTags)('Class - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(1, (0, common_1.Inject)(session_service_1.ISessionService)),
    __param(2, (0, common_1.Inject)(assignment_service_1.IAssignmentService)),
    __param(3, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ManagementClassController);
//# sourceMappingURL=management.class.controller.js.map