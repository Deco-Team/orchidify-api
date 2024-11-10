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
exports.InstructorClassController = void 0;
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
const learner_class_service_1 = require("../services/learner-class.service");
const mongoose_1 = require("mongoose");
const assignment_submission_service_1 = require("../services/assignment-submission.service");
const view_assignment_submission_dto_1 = require("../dto/view-assignment-submission.dto");
const assignment_submission_dto_1 = require("../dto/assignment-submission.dto");
const session_dto_1 = require("../dto/session.dto");
let InstructorClassController = class InstructorClassController {
    constructor(classService, sessionService, assignmentService, learnerClassService, assignmentSubmissionService) {
        this.classService = classService;
        this.sessionService = sessionService;
        this.assignmentService = assignmentService;
        this.learnerClassService = learnerClassService;
        this.assignmentSubmissionService = assignmentSubmissionService;
    }
    async list(req, pagination, queryClassDto) {
        const { _id } = _.get(req, 'user');
        return await this.classService.listByInstructor(_id, pagination, queryClassDto);
    }
    async getDetail(req, classId) {
        const { _id } = _.get(req, 'user');
        const [courseClass, learnerClass] = await Promise.all([
            this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION, [
                {
                    path: 'garden',
                    select: ['name']
                },
                {
                    path: 'course',
                    select: ['code']
                }
            ]),
            this.learnerClassService.findMany({ classId: new mongoose_1.Types.ObjectId(classId) }, undefined, [{ path: 'learner' }])
        ]);
        if (!courseClass || courseClass.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        return { ...courseClass.toJSON(), learners: learnerClass?.map((learnerClass) => learnerClass?.['learner']) };
    }
    async getLessonDetail(req, classId, sessionId) {
        const { _id: instructorId } = _.get(req, 'user');
        const session = await this.sessionService.findOneBy({ sessionId, classId, instructorId });
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        return session;
    }
    async getAssignmentDetail(req, classId, assignmentId) {
        const { _id: instructorId } = _.get(req, 'user');
        const assignment = await this.assignmentService.findOneBy({ assignmentId, classId, instructorId });
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        return assignment;
    }
    async listAssignmentSubmission(req, classId, assignmentId) {
        const { _id } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION);
        if (!courseClass || courseClass.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        return await this.assignmentSubmissionService.list({ classId, assignmentId });
    }
    async getAssignmentSubmissionDetail(req, classId, submissionId) {
        const { _id } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION);
        if (!courseClass || courseClass.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const submission = await this.assignmentSubmissionService.findById(submissionId, undefined, [
            {
                path: 'learner',
                select: ['_id', 'name', 'email', 'avatar']
            }
        ]);
        if (!submission || submission.classId?.toString() !== classId)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_FOUND);
        return submission;
    }
    async gradeAssignmentSubmission(req, classId, submissionId, gradeAssignmentSubmissionDto) {
        const { _id } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId, constant_2.CLASS_DETAIL_PROJECTION);
        if (!courseClass || courseClass.instructorId?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        const submission = await this.assignmentSubmissionService.findById(submissionId);
        if (!submission || submission.classId?.toString() !== classId)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_FOUND);
        if (submission.point !== undefined)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_SUBMISSION_GRADED);
        const { point, feedback } = gradeAssignmentSubmissionDto;
        await this.assignmentSubmissionService.update({ _id: submissionId }, {
            point,
            feedback,
            status: constant_1.SubmissionStatus.GRADED
        });
        return new dto_1.SuccessResponse(true);
    }
    async uploadSessionResources(req, classId, sessionId, uploadSessionResourcesDto) {
        const { _id: instructorId } = _.get(req, 'user');
        const courseClass = await this.classService.findById(classId, '+sessions');
        if (!courseClass || courseClass.instructorId.toString() !== instructorId)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        if (courseClass.status === constant_1.ClassStatus.COMPLETED)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_ENDED);
        if (courseClass.status !== constant_1.ClassStatus.IN_PROGRESS)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_START_YET);
        const session = courseClass?.sessions.find((session) => session._id.toString() === sessionId);
        if (!session)
            throw new app_exception_1.AppException(error_1.Errors.SESSION_NOT_FOUND);
        const originalMedia = session.media.filter((media) => media.isAddedLater !== true);
        const additionalMedia = uploadSessionResourcesDto.media.map((media) => ({ ...media, isAddedLater: true }));
        const media = [...originalMedia, ...additionalMedia];
        await this.classService.update({ _id: new mongoose_1.Types.ObjectId(classId) }, {
            $set: {
                'sessions.$[i].media': media
            }
        }, {
            arrayFilters: [
                {
                    'i._id': new mongoose_1.Types.ObjectId(sessionId)
                }
            ]
        });
        return new dto_1.SuccessResponse(true);
    }
};
exports.InstructorClassController = InstructorClassController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.InstructorViewClassListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_class_dto_1.QueryClassDto]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_dto_1.InstructorViewClassDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Session Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_session_dto_1.ViewSessionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SESSION_NOT_FOUND]),
    (0, common_1.Get)(':classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "getLessonDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Assignment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_assignment_dto_1.ViewAssignmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.ASSIGNMENT_NOT_FOUND]),
    (0, common_1.Get)(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "getAssignmentDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Assignment Submission List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_assignment_submission_dto_1.AssignmentSubmissionListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND]),
    (0, common_1.Get)(':classId([0-9a-f]{24})/assignments/:assignmentId([0-9a-f]{24})/submissions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "listAssignmentSubmission", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Assignment Submission Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_assignment_submission_dto_1.AssignmentSubmissionListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND, error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_FOUND]),
    (0, common_1.Get)(':classId([0-9a-f]{24})/assignment-submissions/:submissionId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('submissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "getAssignmentSubmissionDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Grade Assignment Submission`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.ASSIGNMENT_SUBMISSION_NOT_FOUND,
        error_1.Errors.ASSIGNMENT_SUBMISSION_GRADED
    ]),
    (0, common_1.Post)(':classId([0-9a-f]{24})/assignment-submissions/:submissionId([0-9a-f]{24})/grade'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('submissionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, assignment_submission_dto_1.GradeAssignmentSubmissionDto]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "gradeAssignmentSubmission", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Upload Session Resources`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_NOT_FOUND, error_1.Errors.SESSION_NOT_FOUND, error_1.Errors.CLASS_NOT_START_YET, error_1.Errors.CLASS_ENDED]),
    (0, common_1.Patch)(':classId([0-9a-f]{24})/sessions/:sessionId([0-9a-f]{24})/upload-resources'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Param)('sessionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, session_dto_1.UploadSessionResourcesDto]),
    __metadata("design:returntype", Promise)
], InstructorClassController.prototype, "uploadSessionResources", null);
exports.InstructorClassController = InstructorClassController = __decorate([
    (0, swagger_1.ApiTags)('Class - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(1, (0, common_1.Inject)(session_service_1.ISessionService)),
    __param(2, (0, common_1.Inject)(assignment_service_1.IAssignmentService)),
    __param(3, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __param(4, (0, common_1.Inject)(assignment_submission_service_1.IAssignmentSubmissionService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], InstructorClassController);
//# sourceMappingURL=instructor.class.controller.js.map