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
var ClassRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRequestService = exports.IClassRequestService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment-timezone");
const _ = require("lodash");
const class_request_repository_1 = require("../repositories/class-request.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
const dto_1 = require("../../common/contracts/dto");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const course_service_1 = require("../../course/services/course.service");
const garden_timesheet_service_1 = require("../../garden-timesheet/services/garden-timesheet.service");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const class_service_1 = require("../../class/services/class.service");
const mongoose_2 = require("@nestjs/mongoose");
const progress_dto_1 = require("../../class/dto/progress.dto");
const queue_producer_service_1 = require("../../queue/services/queue-producer.service");
const constant_3 = require("../../queue/contracts/constant");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_4 = require("../../setting/contracts/constant");
const helper_service_1 = require("../../common/services/helper.service");
exports.IClassRequestService = Symbol('IClassRequestService');
let ClassRequestService = ClassRequestService_1 = class ClassRequestService {
    constructor(classRequestRepository, courseService, gardenTimesheetService, classService, connection, queueProducerService, settingService, helperService) {
        this.classRequestRepository = classRequestRepository;
        this.courseService = courseService;
        this.gardenTimesheetService = gardenTimesheetService;
        this.classService = classService;
        this.connection = connection;
        this.queueProducerService = queueProducerService;
        this.settingService = settingService;
        this.helperService = helperService;
        this.appLogger = new app_logger_service_1.AppLogger(ClassRequestService_1.name);
    }
    async createPublishClassRequest(createPublishClassRequestDto, options) {
        const classRequest = await this.classRequestRepository.create(createPublishClassRequestDto, options);
        await this.courseService.update({ _id: classRequest.courseId }, {
            $set: {
                isRequesting: true
            }
        });
        this.addClassRequestAutoExpiredJob(classRequest);
        return classRequest;
    }
    async findById(classRequestId, projection, populates) {
        const classRequest = await this.classRequestRepository.findOne({
            conditions: {
                _id: classRequestId
            },
            projection,
            populates
        });
        return classRequest;
    }
    update(conditions, payload, options) {
        return this.classRequestRepository.findOneAndUpdate(conditions, payload, options);
    }
    async list(pagination, queryClassRequestDto, projection = constant_2.CLASS_REQUEST_LIST_PROJECTION, populates) {
        const { type, status, createdBy } = queryClassRequestDto;
        const filter = {};
        if (createdBy) {
            filter['createdBy'] = new mongoose_1.Types.ObjectId(createdBy);
        }
        const validType = type?.filter((type) => [constant_1.ClassRequestType.PUBLISH_CLASS].includes(type));
        if (validType?.length > 0) {
            filter['type'] = {
                $in: validType
            };
        }
        const validStatus = status?.filter((status) => [
            constant_1.ClassRequestStatus.PENDING,
            constant_1.ClassRequestStatus.APPROVED,
            constant_1.ClassRequestStatus.CANCELED,
            constant_1.ClassRequestStatus.EXPIRED,
            constant_1.ClassRequestStatus.REJECTED
        ].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        return this.classRequestRepository.model.paginate(filter, {
            ...pagination,
            projection: ['-metadata.sessions', '-metadata.media', '-histories'],
            populate: populates
        });
    }
    async findMany(conditions, projection, populates) {
        const classRequests = await this.classRequestRepository.findMany({
            conditions,
            projection,
            populates
        });
        return classRequests;
    }
    async findManyByStatus(status) {
        const classRequests = await this.classRequestRepository.findMany({
            conditions: {
                status: {
                    $in: status
                }
            }
        });
        return classRequests;
    }
    async findManyByCreatedByAndStatus(createdBy, status) {
        const classRequests = await this.classRequestRepository.findMany({
            conditions: {
                createdBy: new mongoose_1.Types.ObjectId(createdBy),
                status: {
                    $in: status
                }
            }
        });
        return classRequests;
    }
    countByCreatedByAndDate(createdBy, date) {
        const startOfDate = moment(date).tz(config_1.VN_TIMEZONE).startOf('date');
        const endOfDate = moment(date).tz(config_1.VN_TIMEZONE).endOf('date');
        return this.classRequestRepository.model.countDocuments({
            createdBy: new mongoose_1.Types.ObjectId(createdBy),
            createdAt: {
                $gte: startOfDate.toDate(),
                $lte: endOfDate.toDate()
            }
        });
    }
    async cancelPublishClassRequest(classRequestId, userAuth) {
        const { _id, role } = userAuth;
        const classRequest = await this.findById(classRequestId);
        if (!classRequest ||
            classRequest.type !== constant_1.ClassRequestType.PUBLISH_CLASS ||
            classRequest.createdBy.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        if (classRequest.status !== constant_1.ClassRequestStatus.PENDING)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_STATUS_INVALID);
        const course = await this.courseService.findById(classRequest.courseId?.toString());
        if (!course || course.instructorId.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_STATUS_INVALID);
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.update({ _id: classRequestId }, {
                    $set: {
                        status: constant_1.ClassRequestStatus.CANCELED
                    },
                    $push: {
                        histories: {
                            status: constant_1.ClassRequestStatus.CANCELED,
                            timestamp: new Date(),
                            userId: new mongoose_1.Types.ObjectId(_id),
                            userRole: role
                        }
                    }
                }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        this.queueProducerService.removeJob(constant_3.QueueName.CLASS_REQUEST, classRequestId);
        return new dto_1.SuccessResponse(true);
    }
    async approvePublishClassRequest(classRequestId, approvePublishClassRequestDto, userAuth) {
        const { gardenId } = approvePublishClassRequestDto;
        const { _id, role } = userAuth;
        const classRequest = await this.findById(classRequestId);
        if (!classRequest || classRequest.type !== constant_1.ClassRequestType.PUBLISH_CLASS)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        if (classRequest.status !== constant_1.ClassRequestStatus.PENDING)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_STATUS_INVALID);
        const course = await this.courseService.findById(classRequest.courseId?.toString(), ['+sessions']);
        if (!course)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_STATUS_INVALID);
        const { startDate, duration, weekdays, slotNumbers } = classRequest?.metadata;
        const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
            startDate,
            duration,
            weekdays,
            instructorId: course.instructorId
        });
        this.appLogger.log(`getAvailableGardenList: slotNumbers=${slotNumbers}, availableSlotNumbers=${availableSlots.slotNumbers}, availableTimeOfGardens=${JSON.stringify(availableSlots.availableTimeOfGardens)}`);
        if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST);
        const availableGardens = availableSlots.availableTimeOfGardens.filter((availableTimeOfGarden) => {
            this.appLogger.log(`gardenId=${availableTimeOfGarden.gardenId}, slotNumbers=${availableTimeOfGarden.slotNumbers}`);
            return _.difference(slotNumbers, availableTimeOfGarden.slotNumbers).length === 0;
        });
        if (availableGardens.length === 0)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST);
        const garden = availableGardens.find((availableGarden) => availableGarden.gardenId?.toString() === gardenId);
        if (!garden)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST);
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.classRequestRepository.findOneAndUpdate({ _id: classRequestId }, {
                    $set: {
                        status: constant_1.ClassRequestStatus.APPROVED
                    },
                    $push: {
                        histories: {
                            status: constant_1.ClassRequestStatus.APPROVED,
                            timestamp: new Date(),
                            userId: new mongoose_1.Types.ObjectId(_id),
                            userRole: role
                        }
                    }
                }, { session });
                await this.courseService.update({ _id: classRequest.courseId }, {
                    $set: {
                        status: constant_1.CourseStatus.ACTIVE,
                        isRequesting: false
                    }
                }, { session });
                const classData = _.pick(classRequest.metadata, [
                    'title',
                    'description',
                    'startDate',
                    'price',
                    'level',
                    'type',
                    'duration',
                    'thumbnail',
                    'media',
                    'sessions',
                    'learnerLimit',
                    'weekdays',
                    'slotNumbers',
                    'gardenRequiredToolkits',
                    'instructorId'
                ]);
                classData['code'] = await this.classService.generateCode();
                classData['status'] = constant_1.ClassStatus.PUBLISHED;
                classData['histories'] = [
                    {
                        status: constant_1.ClassStatus.PUBLISHED,
                        timestamp: new Date(),
                        userId: new mongoose_1.Types.ObjectId(_id),
                        userRole: role
                    }
                ];
                classData['learnerQuantity'] = 0;
                classData['gardenId'] = new mongoose_1.Types.ObjectId(gardenId);
                classData['courseId'] = classRequest.courseId;
                classData['progress'] = new progress_dto_1.BaseProgressDto(_.get(classData, ['duration']) * 2, 0);
                let sessions = _.get(classRequest, 'metadata.sessions');
                classData['sessions'] = this.generateDeadlineClassAssignment({ sessions, startDate, duration, weekdays });
                const createdClass = await this.classService.create(classData, { session });
                await this.gardenTimesheetService.generateSlotsForClass({
                    startDate,
                    duration,
                    weekdays,
                    slotNumbers,
                    gardenId: new mongoose_1.Types.ObjectId(gardenId),
                    instructorId: course.instructorId,
                    classId: new mongoose_1.Types.ObjectId(createdClass._id),
                    metadata: { code: createdClass.code, title: createdClass.title },
                    courseData: course
                }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        this.queueProducerService.removeJob(constant_3.QueueName.CLASS_REQUEST, classRequestId);
        return new dto_1.SuccessResponse(true);
    }
    async rejectPublishClassRequest(classRequestId, rejectPublishClassRequestDto, userAuth) {
        const { rejectReason } = rejectPublishClassRequestDto;
        const { _id, role } = userAuth;
        const classRequest = await this.findById(classRequestId);
        if (!classRequest || classRequest.type !== constant_1.ClassRequestType.PUBLISH_CLASS)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        if (classRequest.status !== constant_1.ClassRequestStatus.PENDING)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_STATUS_INVALID);
        const course = await this.courseService.findById(classRequest.courseId?.toString());
        if (!course)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_STATUS_INVALID);
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.update({ _id: classRequestId }, {
                    $set: {
                        status: constant_1.ClassRequestStatus.REJECTED,
                        rejectReason
                    },
                    $push: {
                        histories: {
                            status: constant_1.ClassRequestStatus.REJECTED,
                            timestamp: new Date(),
                            userId: new mongoose_1.Types.ObjectId(_id),
                            userRole: role
                        }
                    }
                }, { session });
                await this.courseService.update({ _id: classRequest.courseId }, {
                    $set: {
                        isRequesting: false
                    }
                }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        this.queueProducerService.removeJob(constant_3.QueueName.CLASS_REQUEST, classRequestId);
        return new dto_1.SuccessResponse(true);
    }
    async expirePublishClassRequest(classRequestId, userAuth) {
        const { role } = userAuth;
        const classRequest = await this.findById(classRequestId);
        if (!classRequest || classRequest.type !== constant_1.ClassRequestType.PUBLISH_CLASS)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        if (classRequest.status !== constant_1.ClassRequestStatus.PENDING)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_STATUS_INVALID);
        const course = await this.courseService.findById(classRequest.courseId?.toString());
        if (!course)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        if (course.status === constant_1.CourseStatus.DELETED)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_STATUS_INVALID);
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.update({ _id: classRequestId }, {
                    $set: {
                        status: constant_1.ClassRequestStatus.EXPIRED
                    },
                    $push: {
                        histories: {
                            status: constant_1.ClassRequestStatus.EXPIRED,
                            timestamp: new Date(),
                            userRole: role
                        }
                    }
                }, { session });
                await this.courseService.update({ _id: classRequest.courseId }, {
                    $set: {
                        isRequesting: false
                    }
                }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        return new dto_1.SuccessResponse(true);
    }
    async getExpiredAt(date) {
        const classRequestAutoExpiration = await this.settingService.findByKey(constant_4.SettingKey.ClassRequestAutoExpiration);
        const dateMoment = moment.tz(date, config_1.VN_TIMEZONE);
        const expiredDate = dateMoment.clone().add(Number(classRequestAutoExpiration.value) || 2, 'day');
        let expiredAt = expiredDate.clone();
        let currentDate = dateMoment.clone();
        while (currentDate.isSameOrBefore(expiredDate)) {
            if (currentDate.clone().isoWeekday() === 7) {
                expiredAt.add(1, 'day');
            }
            currentDate.add(1, 'day');
        }
        return expiredAt.toDate();
    }
    async addClassRequestAutoExpiredJob(classRequest) {
        try {
            const expiredAt = await this.getExpiredAt(classRequest['createdAt']);
            const delayTime = this.helperService.getDiffTimeByMilliseconds(expiredAt);
            await this.queueProducerService.addJob(constant_3.QueueName.CLASS_REQUEST, constant_3.JobName.ClassRequestAutoExpired, {
                classRequestId: classRequest._id,
                expiredAt
            }, {
                delay: delayTime,
                jobId: classRequest._id.toString()
            });
        }
        catch (err) {
            this.appLogger.error(JSON.stringify(err));
        }
    }
    generateDeadlineClassAssignment(params) {
        const { sessions, startDate, duration, weekdays } = params;
        const startOfDate = moment(startDate).tz(config_1.VN_TIMEZONE).startOf('date');
        const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date');
        const classDates = [];
        let currentDate = startOfDate.clone();
        while (currentDate.isSameOrBefore(endOfDate)) {
            for (let weekday of weekdays) {
                const classDate = currentDate.clone().isoWeekday(weekday);
                if (classDate.isSameOrAfter(startOfDate) && classDate.isBefore(endOfDate)) {
                    classDates.push(classDate.toDate());
                }
            }
            currentDate.add(1, 'week');
        }
        const classEndOfDate = moment(classDates[classDates.length - 1])
            .tz(config_1.VN_TIMEZONE)
            .endOf('date');
        return sessions.map((session) => {
            if (session?.assignments?.length > 0) {
                const sessionStartDate = classDates[session.sessionNumber - 1];
                const assignmentDeadline = moment(sessionStartDate).tz(config_1.VN_TIMEZONE).add(7, 'day').endOf('date');
                const deadline = assignmentDeadline.isAfter(classEndOfDate) ? classEndOfDate : assignmentDeadline;
                session.assignments = session.assignments.map((assignment) => ({ ...assignment, deadline: deadline.toDate() }));
            }
            return session;
        });
    }
};
exports.ClassRequestService = ClassRequestService;
exports.ClassRequestService = ClassRequestService = ClassRequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(class_request_repository_1.IClassRequestRepository)),
    __param(1, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(2, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __param(3, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(4, (0, mongoose_2.InjectConnection)()),
    __param(5, (0, common_1.Inject)(queue_producer_service_1.IQueueProducerService)),
    __param(6, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, mongoose_1.Connection, Object, Object, helper_service_1.HelperService])
], ClassRequestService);
//# sourceMappingURL=class-request.service.js.map