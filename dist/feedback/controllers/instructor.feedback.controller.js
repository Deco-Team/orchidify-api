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
exports.InstructorFeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const feedback_service_1 = require("../services/feedback.service");
const view_feedback_dto_1 = require("../dto/view-feedback.dto");
const mongoose_1 = require("mongoose");
const constant_2 = require("../contracts/constant");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const error_1 = require("../../common/contracts/error");
const course_service_1 = require("../../course/services/course.service");
const app_exception_1 = require("../../common/exceptions/app.exception");
const class_service_1 = require("../../class/services/class.service");
let InstructorFeedbackController = class InstructorFeedbackController {
    constructor(feedbackService, courseService, classService) {
        this.feedbackService = feedbackService;
        this.courseService = courseService;
        this.classService = classService;
    }
    async listCourseFeedback(req, courseId, pagination, queryFeedbackDto) {
        const { _id } = _.get(req, 'user');
        const course = await this.courseService.findById(courseId);
        if (!course || course.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        queryFeedbackDto.courseId = new mongoose_1.Types.ObjectId(courseId);
        return await this.feedbackService.list(pagination, queryFeedbackDto, constant_2.INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION);
    }
    async listClassFeedback(req, classId, queryFeedbackDto) {
        const { _id } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId);
        if (!courseClass || courseClass.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const { rate } = queryFeedbackDto;
        const conditions = {
            classId: new mongoose_1.Types.ObjectId(classId)
        };
        if (rate) {
            conditions['rate'] = rate;
        }
        const feedbacks = await this.feedbackService.findMany(conditions, constant_2.INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION);
        return { docs: feedbacks };
    }
};
exports.InstructorFeedbackController = InstructorFeedbackController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course's Feedback List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.InstructorViewCourseFeedbackListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND]),
    (0, common_1.Get)('courses/:courseId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, pagination_decorator_1.Pagination)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], InstructorFeedbackController.prototype, "listCourseFeedback", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class's Feedback List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.InstructorViewClassFeedbackListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, common_1.Get)('classes/:classId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], InstructorFeedbackController.prototype, "listClassFeedback", null);
exports.InstructorFeedbackController = InstructorFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Feedback - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(feedback_service_1.IFeedbackService)),
    __param(1, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(2, (0, common_1.Inject)(class_service_1.IClassService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], InstructorFeedbackController);
//# sourceMappingURL=instructor.feedback.controller.js.map