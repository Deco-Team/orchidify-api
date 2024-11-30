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
exports.AssignmentService = exports.IAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const moment = require("moment-timezone");
const class_repository_1 = require("../repositories/class.repository");
const mongoose_1 = require("mongoose");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const config_1 = require("../../config");
exports.IAssignmentService = Symbol('IAssignmentService');
let AssignmentService = class AssignmentService {
    constructor(classRepository) {
        this.classRepository = classRepository;
    }
    async findOneBy(params) {
        const { assignmentId, classId, instructorId } = params;
        const conditions = { _id: classId };
        if (instructorId)
            conditions['instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const courseClass = await this.classRepository.findOne({
            conditions,
            projection: 'sessions',
            options: { lean: true }
        });
        let assignment;
        for (let session of courseClass.sessions) {
            assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId);
            if (assignment) {
                assignment['sessionNumber'] = session.sessionNumber;
                break;
            }
        }
        if (!assignment)
            return null;
        return assignment;
    }
    async findMyAssignment(params) {
        const { assignmentId, classId, learnerId } = params;
        const conditions = { _id: classId };
        const courseClass = await this.classRepository.findOne({
            conditions,
            projection: 'sessions',
            populates: [
                {
                    path: 'learnerClass',
                    select: ['learnerId'],
                    match: {
                        learnerId: new mongoose_1.Types.ObjectId(learnerId)
                    }
                }
            ],
            options: { lean: true }
        });
        if (_.get(courseClass, 'learnerClass.learnerId')?.toString() !== learnerId)
            return null;
        let assignment;
        for (let session of courseClass.sessions) {
            assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId);
            if (assignment) {
                assignment['sessionNumber'] = session.sessionNumber;
                break;
            }
        }
        if (!assignment)
            return null;
        return assignment;
    }
    async updateAssignment(params) {
        const { assignmentId, classId, instructorId, updateAssignmentDto } = params;
        const conditions = { _id: classId };
        if (instructorId)
            conditions['instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const courseClass = await this.classRepository.findOne({
            conditions,
            projection: '+sessions',
            options: { lean: true }
        });
        let assignment;
        let classSession;
        for (let session of courseClass.sessions) {
            assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId);
            classSession = session;
            if (assignment !== undefined)
                break;
        }
        if (!assignment)
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_NOT_FOUND);
        const { deadline } = updateAssignmentDto;
        const { startDate, duration, weekdays } = courseClass;
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
        const sessionStartDate = moment(classDates[classSession.sessionNumber - 1])
            .tz(config_1.VN_TIMEZONE)
            .startOf('date');
        const nowMoment = moment().tz(config_1.VN_TIMEZONE);
        const assignmentDeadline = moment(deadline).tz(config_1.VN_TIMEZONE).endOf('date');
        if (assignmentDeadline.isBefore(nowMoment) || assignmentDeadline.isAfter(classEndOfDate) || assignmentDeadline.isBefore(sessionStartDate))
            throw new app_exception_1.AppException(error_1.Errors.ASSIGNMENT_DEADLINE_INVALID);
        classSession.assignments = classSession.assignments.map((assignment) => {
            if (assignment._id.toString() === assignmentId) {
                return { ...assignment, deadline: assignmentDeadline.toDate() };
            }
            return assignment;
        });
        await this.classRepository.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(classId) }, {
            $set: {
                'sessions.$[i].assignments': classSession.assignments
            }
        }, {
            arrayFilters: [
                {
                    'i._id': new mongoose_1.Types.ObjectId(classSession._id)
                }
            ]
        });
    }
};
exports.AssignmentService = AssignmentService;
exports.AssignmentService = AssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(class_repository_1.IClassRepository)),
    __metadata("design:paramtypes", [Object])
], AssignmentService);
//# sourceMappingURL=assignment.service.js.map