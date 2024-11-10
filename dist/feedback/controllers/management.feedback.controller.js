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
exports.ManagementFeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
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
let ManagementFeedbackController = class ManagementFeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async listCourseFeedback(courseId, pagination, queryFeedbackDto) {
        queryFeedbackDto.courseId = new mongoose_1.Types.ObjectId(courseId);
        return await this.feedbackService.list(pagination, queryFeedbackDto, constant_2.FEEDBACK_LIST_PROJECTION, [
            {
                path: 'learner',
                select: constant_2.FEEDBACK_LEANER_DETAIL
            }
        ]);
    }
    async listClassFeedback(classId, queryFeedbackDto) {
        const { rate } = queryFeedbackDto;
        const conditions = {
            classId: new mongoose_1.Types.ObjectId(classId)
        };
        if (rate) {
            conditions['rate'] = rate;
        }
        const feedbacks = await this.feedbackService.findMany(conditions, constant_2.FEEDBACK_LIST_PROJECTION, [
            {
                path: 'learner',
                select: constant_2.FEEDBACK_LEANER_DETAIL
            }
        ]);
        return { docs: feedbacks };
    }
};
exports.ManagementFeedbackController = ManagementFeedbackController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course's Feedback List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.CourseFeedbackListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('courses/:courseId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], ManagementFeedbackController.prototype, "listCourseFeedback", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Class's Feedback List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.ClassFeedbackListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('classes/:classId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], ManagementFeedbackController.prototype, "listClassFeedback", null);
exports.ManagementFeedbackController = ManagementFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Feedback - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(feedback_service_1.IFeedbackService)),
    __metadata("design:paramtypes", [Object])
], ManagementFeedbackController);
//# sourceMappingURL=management.feedback.controller.js.map