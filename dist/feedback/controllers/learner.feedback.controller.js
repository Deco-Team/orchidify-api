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
exports.LearnerFeedbackController = void 0;
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
const feedback_service_1 = require("../services/feedback.service");
const view_feedback_dto_1 = require("../dto/view-feedback.dto");
const mongoose_1 = require("mongoose");
const learner_class_service_1 = require("../../class/services/learner-class.service");
const constant_2 = require("../contracts/constant");
const class_service_1 = require("../../class/services/class.service");
const send_feedback_dto_1 = require("../dto/send-feedback.dto");
const config_1 = require("../../config");
const moment = require("moment-timezone");
const setting_service_1 = require("../../setting/services/setting.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
let LearnerFeedbackController = class LearnerFeedbackController {
    constructor(feedbackService, classService, learnerClassService, settingService) {
        this.feedbackService = feedbackService;
        this.classService = classService;
        this.learnerClassService = learnerClassService;
        this.settingService = settingService;
    }
    async list(courseId, pagination, queryFeedbackDto) {
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
    async sendFeedback(req, classId, sendFeedbackDto) {
        const { _id: learnerId } = _.get(req, 'user');
        const feedback = await this.feedbackService.findOneBy({
            learnerId: new mongoose_1.Types.ObjectId(learnerId),
            classId: new mongoose_1.Types.ObjectId(classId)
        });
        if (feedback)
            throw new app_exception_1.AppException(error_1.Errors.FEEDBACK_SUBMITTED);
        const learnerClass = await this.learnerClassService.findOneBy({
            classId: new mongoose_1.Types.ObjectId(classId),
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        }, ['_id', 'learnerId', 'classId'], [
            {
                path: 'class',
                select: ['startDate', 'duration', 'weekdays', 'slotNumbers', 'courseId', 'ratingSummary'],
                populate: [{ path: 'course', select: ['ratingSummary'] }]
            }
        ]);
        if (!learnerClass)
            throw new app_exception_1.AppException(error_1.Errors.NOT_ENROLL_CLASS_YET);
        const courseClass = _.get(learnerClass, 'class');
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const { startDate, duration, weekdays, slotNumbers } = courseClass;
        const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays, slotNumbers });
        const now = moment().tz(config_1.VN_TIMEZONE);
        const sendFeedbackOpenTime = classEndTime.clone();
        if (now.isBefore(sendFeedbackOpenTime))
            throw new app_exception_1.AppException(error_1.Errors.FEEDBACK_NOT_OPEN_YET);
        sendFeedbackDto.learnerId = new mongoose_1.Types.ObjectId(learnerId);
        sendFeedbackDto.classId = new mongoose_1.Types.ObjectId(classId);
        sendFeedbackDto.courseId = new mongoose_1.Types.ObjectId(courseClass.courseId);
        const course = _.get(courseClass, 'course');
        await this.feedbackService.sendFeedback(sendFeedbackDto, _.get(courseClass, 'ratingSummary', null), _.get(course, 'ratingSummary', null));
        return new dto_1.SuccessResponse(true);
    }
};
exports.LearnerFeedbackController = LearnerFeedbackController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course's Feedback List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.CourseFeedbackListDataResponse }),
    (0, common_1.Get)('courses/:courseId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], LearnerFeedbackController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class's Feedback List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_feedback_dto_1.ClassFeedbackListDataResponse }),
    (0, common_1.Get)('classes/:classId([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, view_feedback_dto_1.QueryFeedbackDto]),
    __metadata("design:returntype", Promise)
], LearnerFeedbackController.prototype, "listClassFeedback", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Send Feedback`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.FEEDBACK_SUBMITTED,
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.NOT_ENROLL_CLASS_YET,
        error_1.Errors.FEEDBACK_NOT_OPEN_YET,
        error_1.Errors.FEEDBACK_IS_OVER
    ]),
    (0, common_1.Post)(':classId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_feedback_dto_1.SendFeedbackDto]),
    __metadata("design:returntype", Promise)
], LearnerFeedbackController.prototype, "sendFeedback", null);
exports.LearnerFeedbackController = LearnerFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Feedback - Learner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Controller)('learner'),
    __param(0, (0, common_1.Inject)(feedback_service_1.IFeedbackService)),
    __param(1, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(2, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __param(3, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], LearnerFeedbackController);
//# sourceMappingURL=learner.feedback.controller.js.map