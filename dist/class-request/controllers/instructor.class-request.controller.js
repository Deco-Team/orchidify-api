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
exports.InstructorClassRequestController = void 0;
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
const class_request_service_1 = require("../services/class-request.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const create_publish_class_request_dto_1 = require("../dto/create-publish-class-request.dto");
const view_class_request_dto_1 = require("../dto/view-class-request.dto");
const constant_2 = require("../contracts/constant");
const mongoose_1 = require("mongoose");
const course_service_1 = require("../../course/services/course.service");
const garden_timesheet_service_1 = require("../../garden-timesheet/services/garden-timesheet.service");
const helper_service_1 = require("../../common/services/helper.service");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_3 = require("../../setting/contracts/constant");
const create_cancel_class_request_dto_1 = require("../dto/create-cancel-class-request.dto");
const class_service_1 = require("../../class/services/class.service");
const learner_class_service_1 = require("../../class/services/learner-class.service");
let InstructorClassRequestController = class InstructorClassRequestController {
    constructor(classRequestService, courseService, classService, gardenTimesheetService, learnerClassService, settingService, helperService) {
        this.classRequestService = classRequestService;
        this.courseService = courseService;
        this.classService = classService;
        this.gardenTimesheetService = gardenTimesheetService;
        this.learnerClassService = learnerClassService;
        this.settingService = settingService;
        this.helperService = helperService;
    }
    async list(req, pagination, queryClassRequestDto) {
        const { _id } = _.get(req, 'user');
        queryClassRequestDto.createdBy = _id;
        return await this.classRequestService.list(pagination, queryClassRequestDto);
    }
    async getDetail(req, classRequestId) {
        const { _id } = _.get(req, 'user');
        const classRequest = await this.classRequestService.findById(classRequestId, constant_2.CLASS_REQUEST_DETAIL_PROJECTION, [
            {
                path: 'class',
                populate: [
                    {
                        path: 'course',
                        select: ['code']
                    }
                ]
            }
        ]);
        if (!classRequest || classRequest.createdBy?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        return classRequest;
    }
    async createPublishClassRequest(req, createPublishClassRequestDto) {
        const { _id, role } = _.get(req, 'user');
        const { startDate, weekdays, slotNumbers } = createPublishClassRequestDto;
        const isValidWeekdays = this.helperService.validateWeekdays(weekdays);
        if (!isValidWeekdays)
            throw new app_exception_1.AppException(error_1.Errors.WEEKDAYS_OF_CLASS_INVALID);
        const createClassRequestLimit = Number((await this.settingService.findByKey(constant_3.SettingKey.CreateClassRequestLimitPerDay)).value) || 10;
        const classRequestsCount = await this.classRequestService.countByCreatedByAndDate(_id, new Date());
        if (classRequestsCount > createClassRequestLimit)
            throw new app_exception_1.AppException(error_1.Errors.CREATE_CLASS_REQUEST_LIMIT);
        const course = await this.courseService.findById(createPublishClassRequestDto.courseId.toString(), ['+sessions']);
        if (!course || course.status === constant_1.CourseStatus.DELETED || course.instructorId.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        const pendingClassRequests = await this.classRequestService.findMany({
            courseId: course._id,
            status: constant_1.ClassRequestStatus.PENDING,
            type: constant_1.ClassRequestType.PUBLISH_CLASS
        });
        if (pendingClassRequests.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS);
        const { duration } = course;
        const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
            startDate,
            duration,
            weekdays,
            instructorId: _id
        });
        if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0)
            throw new app_exception_1.AppException(error_1.Errors.CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID);
        createPublishClassRequestDto['status'] = constant_1.ClassRequestStatus.PENDING;
        createPublishClassRequestDto['histories'] = [
            {
                status: constant_1.ClassRequestStatus.PENDING,
                timestamp: new Date(),
                userId: new mongoose_1.Types.ObjectId(_id),
                userRole: role
            }
        ];
        createPublishClassRequestDto['createdBy'] = new mongoose_1.Types.ObjectId(_id);
        createPublishClassRequestDto['courseId'] = new mongoose_1.Types.ObjectId(createPublishClassRequestDto.courseId);
        createPublishClassRequestDto['type'] = constant_1.ClassRequestType.PUBLISH_CLASS;
        createPublishClassRequestDto['metadata'] = {
            weekdays,
            slotNumbers,
            startDate,
            ...course.toObject()
        };
        const classRequest = await this.classRequestService.createPublishClassRequest(createPublishClassRequestDto);
        return new dto_1.IDResponse(classRequest._id);
    }
    async createCancelClassRequest(req, createCancelClassRequestDto) {
        const { _id, role } = _.get(req, 'user');
        const { classId, description } = createCancelClassRequestDto;
        const createClassRequestLimit = Number((await this.settingService.findByKey(constant_3.SettingKey.CreateClassRequestLimitPerDay)).value) || 10;
        const classRequestsCount = await this.classRequestService.countByCreatedByAndDate(_id, new Date());
        if (classRequestsCount > createClassRequestLimit)
            throw new app_exception_1.AppException(error_1.Errors.CREATE_CLASS_REQUEST_LIMIT);
        const courseClass = await this.classService.findById(classId.toString(), ['-sessions', '-histories'], [
            {
                path: 'course',
                select: ['_id', 'code']
            }
        ]);
        if (!courseClass || courseClass.instructorId.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_NOT_FOUND);
        if (courseClass.status !== constant_1.ClassStatus.PUBLISHED)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_STATUS_INVALID);
        const pendingClassRequests = await this.classRequestService.findMany({
            classId: new mongoose_1.Types.ObjectId(classId),
            status: constant_1.ClassRequestStatus.PENDING,
            type: constant_1.ClassRequestType.CANCEL_CLASS
        });
        if (pendingClassRequests.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS);
        const learnerClasses = await this.learnerClassService.findMany({
            classId: new mongoose_1.Types.ObjectId(classId)
        });
        if (learnerClasses.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS);
        createCancelClassRequestDto['status'] = constant_1.ClassRequestStatus.PENDING;
        createCancelClassRequestDto['histories'] = [
            {
                status: constant_1.ClassRequestStatus.PENDING,
                timestamp: new Date(),
                userId: new mongoose_1.Types.ObjectId(_id),
                userRole: role
            }
        ];
        createCancelClassRequestDto['createdBy'] = new mongoose_1.Types.ObjectId(_id);
        createCancelClassRequestDto['classId'] = new mongoose_1.Types.ObjectId(classId);
        createCancelClassRequestDto['courseId'] = new mongoose_1.Types.ObjectId(_.get(courseClass, 'course._id'));
        createCancelClassRequestDto['type'] = constant_1.ClassRequestType.CANCEL_CLASS;
        createCancelClassRequestDto['metadata'] = {
            code: _.get(courseClass, 'code'),
            course: {
                code: _.get(courseClass, 'course.code')
            }
        };
        const classRequest = await this.classRequestService.createCancelClassRequest(createCancelClassRequestDto);
        return new dto_1.IDResponse(classRequest._id);
    }
    async cancel(req, classRequestId) {
        const user = _.get(req, 'user');
        return this.classRequestService.cancelClassRequest(classRequestId, user);
    }
};
exports.InstructorClassRequestController = InstructorClassRequestController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class Request List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_request_dto_1.InstructorViewClassRequestListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_class_request_dto_1.QueryClassRequestDto]),
    __metadata("design:returntype", Promise)
], InstructorClassRequestController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Class Request Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_request_dto_1.InstructorViewClassRequestDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_REQUEST_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorClassRequestController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create Publish Class Request`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.COURSE_NOT_FOUND,
        error_1.Errors.COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS,
        error_1.Errors.CREATE_CLASS_REQUEST_LIMIT,
        error_1.Errors.CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID,
        error_1.Errors.WEEKDAYS_OF_CLASS_INVALID
    ]),
    (0, common_1.Post)('publish-class'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_publish_class_request_dto_1.CreatePublishClassRequestDto]),
    __metadata("design:returntype", Promise)
], InstructorClassRequestController.prototype, "createPublishClassRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create Cancel Class Request`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS,
        error_1.Errors.CREATE_CLASS_REQUEST_LIMIT,
        error_1.Errors.CLASS_STATUS_INVALID
    ]),
    (0, common_1.Post)('cancel-class'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cancel_class_request_dto_1.CreateCancelClassRequestDto]),
    __metadata("design:returntype", Promise)
], InstructorClassRequestController.prototype, "createCancelClassRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Cancel Publish/Cancel Class Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_REQUEST_NOT_FOUND,
        error_1.Errors.CLASS_REQUEST_STATUS_INVALID,
        error_1.Errors.COURSE_NOT_FOUND,
        error_1.Errors.CLASS_NOT_FOUND,
        error_1.Errors.COURSE_STATUS_INVALID
    ]),
    (0, common_1.Patch)(':id([0-9a-f]{24})/cancel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorClassRequestController.prototype, "cancel", null);
exports.InstructorClassRequestController = InstructorClassRequestController = __decorate([
    (0, swagger_1.ApiTags)('ClassRequest - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(class_request_service_1.IClassRequestService)),
    __param(1, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(2, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(3, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __param(4, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __param(5, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, helper_service_1.HelperService])
], InstructorClassRequestController);
//# sourceMappingURL=instructor.class-request.controller.js.map