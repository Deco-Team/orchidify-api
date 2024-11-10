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
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = exports.IAttendanceService = void 0;
const common_1 = require("@nestjs/common");
const attendance_repository_1 = require("../repositories/attendance.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../contracts/constant");
const app_logger_service_1 = require("../../common/services/app-logger.service");
exports.IAttendanceService = Symbol('IAttendanceService');
let AttendanceService = AttendanceService_1 = class AttendanceService {
    constructor(attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
        this.appLogger = new app_logger_service_1.AppLogger(AttendanceService_1.name);
    }
    async create(takeAttendanceDto, options) {
        return await this.attendanceRepository.create({ ...takeAttendanceDto }, options);
    }
    async update(conditions, payload, options) {
        return await this.attendanceRepository.findOneAndUpdate(conditions, payload, options);
    }
    bulkWrite(slotId, takeAttendanceDto) {
        const operations = [];
        for (const attendance of takeAttendanceDto) {
            operations.push({
                updateOne: {
                    filter: { learnerId: new mongoose_1.Types.ObjectId(attendance.learnerId), slotId: new mongoose_1.Types.ObjectId(slotId) },
                    update: {
                        $set: { ...attendance, learnerId: new mongoose_1.Types.ObjectId(attendance.learnerId) }
                    },
                    upsert: true
                }
            });
        }
        return this.attendanceRepository.model.bulkWrite(operations);
    }
    async findById(attendanceId, projection, populates) {
        const attendance = await this.attendanceRepository.findOne({
            conditions: {
                _id: attendanceId
            },
            projection,
            populates
        });
        return attendance;
    }
    async findOneBy(conditions, projection, populates) {
        const attendance = await this.attendanceRepository.findOne({
            conditions,
            projection,
            populates
        });
        return attendance;
    }
    async findMany(conditions, projection, populates) {
        const attendances = await this.attendanceRepository.findMany({
            conditions,
            projection,
            populates
        });
        return attendances;
    }
    async list(queryCourseDto, projection = constant_1.ATTENDANCE_LIST_PROJECTION, populate) {
        const { slotId } = queryCourseDto;
        const filter = {};
        if (slotId) {
            filter['slotId'] = slotId;
        }
        return this.attendanceRepository.model.paginate(filter, {
            projection,
            populate
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(attendance_repository_1.IAttendanceRepository)),
    __metadata("design:paramtypes", [Object])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map