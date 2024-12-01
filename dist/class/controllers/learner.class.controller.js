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
exports.LearnerClassController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const class_service_1 = require("../services/class.service");
const assignment_service_1 = require("../services/assignment.service");
const session_service_1 = require("../services/session.service");
const constant_2 = require("../../transaction/contracts/constant");
const mongoose_1 = require("mongoose");
const momo_payment_dto_1 = require("../../transaction/dto/momo-payment.dto");
const enroll_class_dto_1 = require("../dto/enroll-class.dto");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const app_exception_1 = require("../../common/exceptions/app.exception");
const view_class_dto_1 = require("../dto/view-class.dto");
const learner_class_service_1 = require("../services/learner-class.service");
const constant_3 = require("../contracts/constant");
const constant_4 = require("../../instructor/contracts/constant");
const view_session_dto_1 = require("../dto/view-session.dto");
const view_assignment_dto_1 = require("../dto/view-assignment.dto");
const assignment_submission_dto_1 = require("../dto/assignment-submission.dto");
const assignment_submission_service_1 = require("../services/assignment-submission.service");
const stripe_payment_dto_1 = require("../../transaction/dto/stripe-payment.dto");
const config_1 = require("../../config");
const moment = require("moment-timezone");
const feedback_service_1 = require("../../feedback/services/feedback.service");
const constant_5 = require("../../feedback/contracts/constant");
let LearnerClassController = class LearnerClassController {
    constructor(classService, sessionService, assignmentService, learnerClassService, assignmentSubmissionService, feedbackService) {
        this.classService = classService;
        this.sessionService = sessionService;
        this.assignmentService = assignmentService;
        this.learnerClassService = learnerClassService;
        this.assignmentSubmissionService = assignmentSubmissionService;
        this.feedbackService = feedbackService;
    }
    async enrollClass(req, classId, enrollClassDto) {
        const { _id } = _.get(req, 'user');
        const createPaymentResponse = await this.classService.enrollClass({
            classId: new mongoose_1.Types.ObjectId(classId),
            paymentMethod: enrollClassDto.paymentMethod || constant_2.PaymentMethod.STRIPE,
            learnerId: _id,
            requestType: enrollClassDto.requestType
        });
        return createPaymentResponse;
    }
    async myClassList(req, pagination, queryClassDto) {
        const { _id } = _.get(req, 'user');
        return await this.learnerClassService.listMyClassesByLearner(_id, pagination, queryClassDto);
    }
    async getDetail(req, classId) {
        const { _id } = _.get(req, 'user');
        const [learnerClass, feedback] = await Promise.all([
            this.learnerClassService.findOneBy({ learnerId: new mongoose_1.Types.ObjectId(_id), classId: new mongoose_1.Types.ObjectId(classId) }, undefined, [
                {
                    path: 'class',
                    select: constant_3.LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION,
                    populate: [
                        {
                            path: 'garden',
                            select: ['name']
                        },
                        {
                            path: 'instructor',
                            select: constant_4.MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION
                        }
                    ]
                }
            ]),
            this.feedbackService.findOneBy({
                learnerId: new mongoose_1.Types.ObjectId(_id),
                classId: new mongoose_1.Types.ObjectId(classId)
            }, constant_5.FEEDBACK_DETAIL_PROJECTION)
        ]);
        if (!learnerClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        return { ...learnerClass?.toObject()['class'], hasSentFeedback: !!feedback };
    }
    async getLessonDetail(req, classId, sessionId) {
        const { _id: learnerId } = _.get(req, 'user');
        const session = await this.sessionService.findMySession({ sessionId, classId, learnerId });
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        return session;
    }
    async getAssignmentDetail(req, classId, assignmentId) {
        const { _id: learnerId } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId, undefined, [
            {
                path: 'instructor',
                select: ['_id', 'name', 'idCardPhoto', 'avatar']
            }
        ]);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const assignment = await this.assignmentService.findMyAssignment({ assignmentId, classId, learnerId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        const submission = await this.assignmentSubmissionService.findMyAssignmentSubmission({
            assignmentId: assignment._id,
            learnerId: learnerId
        });
        return { ...assignment, submission, instructor: courseClass['instructor'] };
    }
    async submitAssignment(req, classId, createAssignmentSubmissionDto) {
        const { _id: learnerId } = _.get(req, 'user');
        const { assignmentId } = createAssignmentSubmissionDto;
        const courseClass = await this.classService.findById(classId);
        if (!courseClass)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const { startDate } = courseClass;
        const classStartDate = moment(startDate).tz(config_1.VN_TIMEZONE).startOf('date');
        const nowMoment = moment().tz(config_1.VN_TIMEZONE);
        if (nowMoment.isBefore(classStartDate))
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_START_YET);
        const assignment = await this.assignmentService.findMyAssignment({ assignmentId, classId, learnerId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        if (assignment.deadline) {
            const assignmentDeadline = moment(assignment.deadline).tz(config_1.VN_TIMEZONE);
            if (nowMoment.isAfter(assignmentDeadline))
                throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMISSION_DEADLINE_IS_OVER);
        }
        const existedSubmission = await this.assignmentSubmissionService.findMyAssignmentSubmission({
            assignmentId,
            learnerId
        });
        if (existedSubmission)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMITTED);
        createAssignmentSubmissionDto.classId = classId;
        createAssignmentSubmissionDto.learnerId = learnerId;
        const submission = await this.assignmentSubmissionService.create(createAssignmentSubmissionDto);
        return new dto_1.IDResponse(submission._id);
    }
};
exports.LearnerClassController = LearnerClassController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Enroll Class`
    }),
    (0, swagger_1.ApiExtraModels)(stripe_payment_dto_1.CreateStripePaymentDataResponse, momo_payment_dto_1.CreateMomoPaymentDataResponse),
    (0, swagger_1.ApiCreatedResponse)({
        schema: { anyOf: (0, swagger_1.refs)(stripe_payment_dto_1.CreateStripePaymentDataResponse, momo_payment_dto_1.CreateMomoPaymentDataResponse) }
    }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.UNVERIFIED_ACCOUNT,
        error_1.Errors.INACTIVE_ACCOUNT,
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.CLASS_STATUS_INVALID,
        error_1.Errors.CLASS_LEARNER_LIMIT,
        error_1.Errors.LEARNER_CLASS_EXISTED,
        error_1.Errors.CLASS_TIMESHEET_INVALID
    ]),
    (0, common_1.Post)('enroll/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, enroll_class_dto_1.EnrollClassDto]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "enrollClass", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View My Class List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.LearnerViewMyClassListDataResponse }),
    (0, common_1.Get)('my-classes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_class_dto_1.QueryClassDto]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "myClassList", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View My Class Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.LearnerViewMyClassDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, common_1.Get)('my-classes/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View My Session Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_session_dto_1.ViewSessionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SESSION_NOT_FOUND]),
    (0, common_1.Get)('my-classes/:classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "getLessonDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View My Assignment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_assignment_dto_1.ViewAssignmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND, error_1.Errors.ASSIGNMENT_NOT_FOUND]),
    (0, common_1.Get)('my-classes/:classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "getAssignmentDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Submit Assignment`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_START_YET,
        error_1.Errors.ASSIGNMENT_NOT_FOUND,
        error_1.Errors.ASSIGNMENT_SUBMISSION_DEADLINE_IS_OVER,
        error_1.Errors.ASSIGNMENT_SUBMITTED
    ]),
    (0, common_1.Post)(':classId([0-9a-f]{24})/submit-assignment'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, assignment_submission_dto_1.CreateAssignmentSubmissionDto]),
    __metadata("design:returntype", Promise)
], LearnerClassController.prototype, "submitAssignment", null);
exports.LearnerClassController = LearnerClassController = __decorate([
    (0, swagger_1.ApiTags)('Class - Learner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Controller)('learner'),
    __param(0, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(1, (0, common_1.Inject)(session_service_1.ISessionService)),
    __param(2, (0, common_1.Inject)(assignment_service_1.IAssignmentService)),
    __param(3, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __param(4, (0, common_1.Inject)(assignment_submission_service_1.IAssignmentSubmissionService)),
    __param(5, (0, common_1.Inject)(feedback_service_1.IFeedbackService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], LearnerClassController);
//# sourceMappingURL=learner.class.controller.js.map