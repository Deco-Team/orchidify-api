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
exports.InstructorAttendanceController = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment-timezone");
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
const attendance_service_1 = require("../services/attendance.service");
const view_attendance_dto_1 = require("../dto/view-attendance.dto");
const take_attendance_dto_1 = require("../dto/take-attendance.dto");
const garden_timesheet_service_1 = require("../../garden-timesheet/services/garden-timesheet.service");
const mongoose_1 = require("mongoose");
const learner_class_service_1 = require("../../class/services/learner-class.service");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
let InstructorAttendanceController = class InstructorAttendanceController {
    constructor(attendanceService, gardenTimesheetService, learnerClassService) {
        this.attendanceService = attendanceService;
        this.gardenTimesheetService = gardenTimesheetService;
        this.learnerClassService = learnerClassService;
    }
    async list(req, slotId) {
        const { _id: instructorId } = _.get(req, 'user');
        const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
            'slots._id': new mongoose_1.Types.ObjectId(slotId),
            'slots.instructorId': new mongoose_1.Types.ObjectId(instructorId)
        });
        if (!gardenTimesheet)
            throw new app_exception_1.AppException(error_1.Errors.SLOT_NOT_FOUND);
        const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId);
        if (!slot)
            throw new app_exception_1.AppException(error_1.Errors.SLOT_NOT_FOUND);
        if (!slot.hasTakenAttendance) {
            const learnerClasses = await this.learnerClassService.findMany({
                classId: slot.classId
            }, ['-_id', 'learnerId'], [
                {
                    path: 'learner',
                    select: ['_id', 'name', 'avatar']
                }
            ]);
            return {
                docs: learnerClasses.map((learnerClass) => ({
                    ...learnerClass.toObject(),
                    status: constant_1.AttendanceStatus.NOT_YET
                })),
                slot
            };
        }
        else {
            const attendances = await this.attendanceService.findMany({
                slotId: slot._id
            }, constant_2.ATTENDANCE_LIST_PROJECTION, [
                {
                    path: 'learner',
                    select: ['_id', 'name', 'avatar']
                }
            ]);
            return { docs: attendances, slot };
        }
    }
    async takeAttendance(req, slotId, takeMultipleAttendanceDto) {
        const { _id: instructorId } = _.get(req, 'user');
        const { attendances } = takeMultipleAttendanceDto;
        const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
            'slots._id': new mongoose_1.Types.ObjectId(slotId),
            'slots.instructorId': new mongoose_1.Types.ObjectId(instructorId)
        });
        if (!gardenTimesheet)
            throw new app_exception_1.AppException(error_1.Errors.SLOT_NOT_FOUND);
        const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId);
        if (!slot)
            throw new app_exception_1.AppException(error_1.Errors.SLOT_NOT_FOUND);
        const nowMoment = moment().tz(config_1.VN_TIMEZONE);
        const startOfSlot = moment(slot.start).tz(config_1.VN_TIMEZONE);
        if (nowMoment.isBefore(startOfSlot))
            throw new app_exception_1.AppException(error_1.Errors.NOT_TIME_TO_TAKE_ATTENDANCE);
        const endOfDate = startOfSlot.clone().endOf('date');
        if (nowMoment.isAfter(endOfDate))
            throw new app_exception_1.AppException(error_1.Errors.TAKE_ATTENDANCE_IS_OVER);
        const learnerClasses = await this.learnerClassService.findMany({
            classId: slot.classId
        }, ['_id', 'learnerId']);
        const classLearnerIds = learnerClasses.map((learnerClass) => learnerClass.learnerId.toString());
        const attendanceLearners = attendances.filter((attendance) => classLearnerIds.includes(attendance.learnerId));
        const attendanceLearnersSet = new Set([
            ...attendanceLearners.map((attendanceLearner) => attendanceLearner.learnerId)
        ]);
        if (attendanceLearners.length !== attendanceLearnersSet.size)
            throw new app_exception_1.AppException(error_1.Errors.NUMBER_OF_ATTENDANCES_INVALID);
        if (!slot.hasTakenAttendance) {
            if (attendanceLearners.length !== classLearnerIds.length)
                throw new app_exception_1.AppException(error_1.Errors.NUMBER_OF_ATTENDANCES_INVALID);
            await this.attendanceService.bulkWrite(slotId, attendanceLearners, slot.classId.toString());
            await this.gardenTimesheetService.update({ 'slots._id': new mongoose_1.Types.ObjectId(slotId) }, { $set: { 'slots.$.hasTakenAttendance': true } });
        }
        else {
            await this.attendanceService.bulkWrite(slotId, attendanceLearners, slot.classId.toString());
        }
        return new dto_1.SuccessResponse(true);
    }
};
exports.InstructorAttendanceController = InstructorAttendanceController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Attendance List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_attendance_dto_1.AttendanceListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SLOT_NOT_FOUND]),
    (0, common_1.Get)(':slotId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorAttendanceController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Take Attendance`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.SLOT_NOT_FOUND,
        error_1.Errors.NUMBER_OF_ATTENDANCES_INVALID,
        error_1.Errors.NOT_TIME_TO_TAKE_ATTENDANCE,
        error_1.Errors.TAKE_ATTENDANCE_IS_OVER
    ]),
    (0, common_1.Post)(':slotId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slotId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, take_attendance_dto_1.TakeMultipleAttendanceDto]),
    __metadata("design:returntype", Promise)
], InstructorAttendanceController.prototype, "takeAttendance", null);
exports.InstructorAttendanceController = InstructorAttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(attendance_service_1.IAttendanceService)),
    __param(1, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __param(2, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], InstructorAttendanceController);
//# sourceMappingURL=instructor.attendance.controller.js.map