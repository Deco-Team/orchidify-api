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
var ClassQueueConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassQueueConsumer = void 0;
const moment = require("moment-timezone");
const constant_1 = require("../../common/contracts/constant");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
const class_service_1 = require("../../class/services/class.service");
const garden_timesheet_service_1 = require("../../garden-timesheet/services/garden-timesheet.service");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_3 = require("../../setting/contracts/constant");
let ClassQueueConsumer = ClassQueueConsumer_1 = class ClassQueueConsumer extends bullmq_1.WorkerHost {
    constructor(classService, gardenTimesheetService, settingService) {
        super();
        this.classService = classService;
        this.gardenTimesheetService = gardenTimesheetService;
        this.settingService = settingService;
        this.appLogger = new app_logger_service_1.AppLogger(ClassQueueConsumer_1.name);
    }
    async process(job) {
        this.appLogger.log(`[process] Processing job id=${job.id}`);
        try {
            switch (job.name) {
                case constant_2.JobName.UpdateClassStatusInProgress: {
                    return await this.updateClassStatusInProgress(job);
                }
                case constant_2.JobName.UpdateClassProgressEndSlot: {
                    return await this.updateClassProgressEndSlot(job);
                }
                case constant_2.JobName.ClassAutoCompleted: {
                    return await this.completeClassAutomatically(job);
                }
                default:
            }
            this.appLogger.log('[process] Job processed successfully');
        }
        catch (error) {
            this.appLogger.error(error);
            throw error;
        }
    }
    async updateClassStatusInProgress(job) {
        this.appLogger.debug(`[updateClassStatusInProgress]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`);
        try {
            this.appLogger.log(`[updateClassStatusInProgress]: Start update class status... id=${job.id}`);
            const courseClasses = await this.classService.findManyByStatus([constant_1.ClassStatus.PUBLISHED]);
            if (courseClasses.length === 0)
                return 'No PUBLISHED status class';
            const nowMoment = moment().tz(config_1.VN_TIMEZONE).startOf('date');
            const updateClassStatusPromises = [];
            courseClasses.forEach((courseClass) => {
                const startOfDate = moment(courseClass.startDate).tz(config_1.VN_TIMEZONE).startOf('date');
                if (startOfDate.isSameOrBefore(nowMoment)) {
                    updateClassStatusPromises.push(this.classService.update({ _id: courseClass._id }, {
                        $set: { status: constant_1.ClassStatus.IN_PROGRESS },
                        $push: {
                            histories: {
                                status: constant_1.ClassStatus.IN_PROGRESS,
                                timestamp: new Date(),
                                userRole: 'SYSTEM'
                            }
                        }
                    }));
                }
            });
            await Promise.all(updateClassStatusPromises);
            this.appLogger.log(`[updateClassStatusInProgress]: End update status... id=${job.id}`);
            return { status: true, numbersOfUpdatedClass: updateClassStatusPromises.length };
        }
        catch (error) {
            this.appLogger.error(`[updateClassStatusInProgress]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
    async updateClassProgressEndSlot(job) {
        const { slotNumber } = job.data;
        this.appLogger.debug(`[updateClassProgressEndSlot]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`);
        try {
            this.appLogger.log(`[updateClassProgressEndSlot]: Start update class progress... id=${job.id}`);
            const startOfDate = moment().tz(config_1.VN_TIMEZONE).startOf('date');
            let start, end;
            switch (slotNumber) {
                case constant_1.SlotNumber.ONE:
                    start = startOfDate.clone().add(7, 'hour').toDate();
                    end = startOfDate.clone().add(9, 'hour').toDate();
                    break;
                case constant_1.SlotNumber.TWO:
                    start = startOfDate.clone().add(9, 'hour').add(30, 'minute').toDate();
                    end = startOfDate.clone().add(11, 'hour').add(30, 'minute').toDate();
                    break;
                case constant_1.SlotNumber.THREE:
                    start = startOfDate.clone().add(13, 'hour').toDate();
                    end = startOfDate.clone().add(15, 'hour').toDate();
                    break;
                case constant_1.SlotNumber.FOUR:
                    start = startOfDate.clone().add(15, 'hour').add(30, 'minute').toDate();
                    end = startOfDate.clone().add(17, 'hour').add(30, 'minute').toDate();
                    break;
            }
            const timesheets = await this.gardenTimesheetService.findMany({
                'slots.start': start,
                'slots.end': end
            });
            const classIds = new Set();
            for (const timesheet of timesheets) {
                for (const slot of timesheet.slots) {
                    if (slot.status === constant_1.SlotStatus.NOT_AVAILABLE && slot.slotNumber === slotNumber) {
                        classIds.add(slot.classId);
                    }
                }
            }
            const courseClasses = await this.classService.findMany({
                _id: {
                    $in: [...classIds]
                }
            });
            const updateClassProgressPromises = [];
            courseClasses.forEach((courseClass) => {
                const completed = courseClass.progress.completed + 1;
                const total = courseClass.progress.total;
                const percentage = Math.round((completed / total) * 100);
                updateClassProgressPromises.push(this.classService.update({ _id: courseClass._id }, {
                    $set: { progress: { completed, total, percentage } }
                }));
            });
            await Promise.all(updateClassProgressPromises);
            this.appLogger.log(`[updateClassProgressEndSlot]: End update class progress... id=${job.id}`);
            return { status: true, numbersOfUpdatedClass: classIds.size };
        }
        catch (error) {
            this.appLogger.error(`[updateClassProgressEndSlot]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
    async completeClassAutomatically(job) {
        this.appLogger.debug(`[completeClassAutomatically]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`);
        try {
            this.appLogger.log(`[completeClassAutomatically]: Start complete class ... id=${job.id}`);
            const startOfDate = moment().tz(config_1.VN_TIMEZONE).startOf('date');
            const classAutoCompleteAfterDay = Number((await this.settingService.findByKey(constant_3.SettingKey.ClassAutoCompleteAfterDay)).value) || 5;
            const courseClasses = await this.classService.findMany({
                status: constant_1.ClassStatus.IN_PROGRESS
            });
            const completeClassPromises = [];
            courseClasses.forEach((courseClass) => {
                const { startDate, duration, weekdays } = courseClass;
                const classEndTime = this.classService.getClassEndTime({ startDate, duration, weekdays });
                if (classEndTime.isBefore(startOfDate) &&
                    classEndTime.clone().add(classAutoCompleteAfterDay, 'day').isSameOrAfter(startOfDate)) {
                    completeClassPromises.push(this.classService.completeClass(courseClass._id, { role: 'SYSTEM' }));
                }
            });
            await Promise.all(completeClassPromises);
            this.appLogger.log(`[completeClassAutomatically]: End complete class... id=${job.id}`);
            return { status: true, numbersOfCompletedClass: completeClassPromises.length };
        }
        catch (error) {
            this.appLogger.error(`[completeClassAutomatically]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
};
exports.ClassQueueConsumer = ClassQueueConsumer;
exports.ClassQueueConsumer = ClassQueueConsumer = ClassQueueConsumer_1 = __decorate([
    (0, bullmq_1.Processor)(constant_2.QueueName.CLASS),
    __param(0, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(1, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __param(2, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ClassQueueConsumer);
//# sourceMappingURL=class.queue-consumer.js.map