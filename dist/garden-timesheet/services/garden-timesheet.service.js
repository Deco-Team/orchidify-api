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
var GardenTimesheetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenTimesheetService = exports.IGardenTimesheetService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment-timezone");
const _ = require("lodash");
const garden_timesheet_repository_1 = require("../repositories/garden-timesheet.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../common/contracts/constant");
const config_1 = require("../../config");
const create_garden_timesheet_dto_1 = require("../dto/create-garden-timesheet.dto");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const constant_2 = require("../contracts/constant");
const garden_repository_1 = require("../../garden/repositories/garden.repository");
const slot_dto_1 = require("../dto/slot.dto");
const helper_service_1 = require("../../common/services/helper.service");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const class_service_1 = require("../../class/services/class.service");
const learner_class_service_1 = require("../../class/services/learner-class.service");
exports.IGardenTimesheetService = Symbol('IGardenTimesheetService');
let GardenTimesheetService = GardenTimesheetService_1 = class GardenTimesheetService {
    constructor(gardenTimesheetRepository, gardenRepository, helperService, classService, learnerClassService) {
        this.gardenTimesheetRepository = gardenTimesheetRepository;
        this.gardenRepository = gardenRepository;
        this.helperService = helperService;
        this.classService = classService;
        this.learnerClassService = learnerClassService;
        this.appLogger = new app_logger_service_1.AppLogger(GardenTimesheetService_1.name);
    }
    async findById(gardenTimesheetId, projection, populates) {
        const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
            conditions: {
                _id: gardenTimesheetId
            },
            projection,
            populates
        });
        return gardenTimesheet;
    }
    async findOneBy(conditions, projection, populates) {
        const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
            conditions,
            projection,
            populates
        });
        return gardenTimesheet;
    }
    async findSlotBy(params) {
        const { slotId, instructorId } = params;
        const conditions = { 'slots._id': new mongoose_1.Types.ObjectId(slotId) };
        if (instructorId)
            conditions['slots.instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const gardenTimesheet = await this.gardenTimesheetRepository.findOne({
            conditions,
            options: { lean: true }
        });
        if (!gardenTimesheet)
            return null;
        const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId);
        const [garden, courseClass] = await Promise.all([
            this.gardenRepository.findOne({
                conditions: {
                    _id: gardenTimesheet.gardenId
                },
                projection: ['name']
            }),
            this.classService.findById(slot.classId.toString(), constant_2.SLOT_CLASS_DETAIL_PROJECTION, [
                { path: 'course', select: ['code'] }
            ])
        ]);
        return {
            createdAt: gardenTimesheet['createdAt'],
            updatedAt: gardenTimesheet['updatedAt'],
            ...slot,
            garden,
            class: courseClass
        };
    }
    update(conditions, payload, options) {
        return this.gardenTimesheetRepository.findOneAndUpdate(conditions, payload, options);
    }
    async viewGardenTimesheetList(queryGardenTimesheetDto, garden) {
        const { type, gardenId, date } = queryGardenTimesheetDto;
        const dateMoment = moment(date).tz(config_1.VN_TIMEZONE);
        this.appLogger.log(`viewGardenTimesheetList: type=${type}, gardenId=${gardenId}, date=${date}`);
        const existedGardenTimesheet = await this.gardenTimesheetRepository.findOne({
            conditions: {
                gardenId: new mongoose_1.Types.ObjectId(gardenId),
                date: dateMoment.clone().startOf('month')
            }
        });
        if (!existedGardenTimesheet) {
            console.time(`generateTimesheetOfMonth: gardenId=${gardenId}, date=${date}`);
            await this.generateTimesheetOfMonth(gardenId, date, garden.maxClass);
            console.timeEnd(`generateTimesheetOfMonth: gardenId=${gardenId}, date=${date}`);
        }
        let fromDate, toDate;
        if (type === constant_1.TimesheetType.MONTH) {
            fromDate = dateMoment.clone().startOf('month').toDate();
            toDate = dateMoment.clone().endOf('month').toDate();
        }
        else if (type === constant_1.TimesheetType.WEEK) {
            fromDate = dateMoment.clone().startOf('isoWeek').toDate();
            toDate = dateMoment.clone().endOf('isoWeek').toDate();
        }
        const timesheets = await this.gardenTimesheetRepository.findMany({
            projection: constant_2.VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
            options: { lean: true },
            conditions: {
                gardenId: new mongoose_1.Types.ObjectId(gardenId),
                date: {
                    $gte: fromDate,
                    $lte: toDate
                },
                $or: [
                    {
                        status: constant_1.GardenTimesheetStatus.INACTIVE
                    },
                    {
                        'slots.status': constant_1.SlotStatus.NOT_AVAILABLE
                    }
                ]
            }
        });
        return this.transformDataToCalendar(timesheets);
    }
    async viewTeachingTimesheet(queryTeachingTimesheetDto) {
        const { type, instructorId, date } = queryTeachingTimesheetDto;
        const dateMoment = moment(date).tz(config_1.VN_TIMEZONE);
        this.appLogger.log(`viewTeachingTimesheet: type=${type}, instructorId=${instructorId}, date=${date}`);
        let fromDate, toDate;
        if (type === constant_1.TimesheetType.MONTH) {
            fromDate = dateMoment.clone().startOf('month').toDate();
            toDate = dateMoment.clone().endOf('month').toDate();
        }
        else if (type === constant_1.TimesheetType.WEEK) {
            fromDate = dateMoment.clone().startOf('isoWeek').toDate();
            toDate = dateMoment.clone().endOf('isoWeek').toDate();
        }
        const timesheets = await this.gardenTimesheetRepository.findMany({
            projection: constant_2.VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
            options: { lean: true },
            conditions: {
                date: {
                    $gte: fromDate,
                    $lte: toDate
                },
                'slots.instructorId': new mongoose_1.Types.ObjectId(instructorId)
            }
        });
        return this.transformDataToTeachingCalendar(timesheets, instructorId);
    }
    async viewMyTimesheet(queryMyTimesheetDto) {
        const { type, learnerId, date } = queryMyTimesheetDto;
        const dateMoment = moment(date).tz(config_1.VN_TIMEZONE);
        this.appLogger.log(`viewMyTimesheet: type=${type}, learnerId=${learnerId}, date=${date}`);
        let fromDate, toDate;
        if (type === constant_1.TimesheetType.MONTH) {
            fromDate = dateMoment.clone().startOf('month').toDate();
            toDate = dateMoment.clone().endOf('month').toDate();
        }
        else if (type === constant_1.TimesheetType.WEEK) {
            fromDate = dateMoment.clone().startOf('isoWeek').toDate();
            toDate = dateMoment.clone().endOf('isoWeek').toDate();
        }
        const learnerClasses = await this.learnerClassService.findMany({
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        });
        const classIds = learnerClasses.map((learnerClass) => learnerClass.classId);
        const timesheets = await this.gardenTimesheetRepository.findMany({
            projection: constant_2.VIEW_GARDEN_TIMESHEET_LIST_PROJECTION,
            options: { lean: true },
            conditions: {
                date: {
                    $gte: fromDate,
                    $lte: toDate
                },
                'slots.classId': {
                    $in: classIds
                }
            }
        });
        return this.transformDataToMyCalendar(timesheets, classIds.map((classId) => classId.toString()));
    }
    async viewAvailableTime(queryAvailableTimeDto) {
        const { startDate, duration, weekdays, instructorId } = queryAvailableTimeDto;
        const isValidWeekdays = this.helperService.validateWeekdays(weekdays);
        if (!isValidWeekdays)
            throw new app_exception_1.AppException(error_1.Errors.WEEKDAYS_OF_CLASS_INVALID);
        const startOfDate = moment(startDate).tz(config_1.VN_TIMEZONE).startOf('date');
        const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date');
        this.appLogger.log(`viewAvailableTime: startOfDate=${startOfDate.toISOString()}, duration=${duration}, endOfDate=${endOfDate.toISOString()}, weekdays=${weekdays}`);
        await this.generateAllTimesheetFromDateRange(startOfDate, endOfDate);
        const searchDates = [];
        let currentDate = startOfDate.clone();
        while (currentDate.isSameOrBefore(endOfDate)) {
            for (let weekday of weekdays) {
                const searchDate = currentDate.clone().isoWeekday(weekday);
                if (searchDate.isSameOrAfter(startOfDate) && searchDate.isBefore(endOfDate)) {
                    searchDates.push(searchDate.toDate());
                }
            }
            currentDate.add(1, 'week');
        }
        const groupGardenTimesheets = await this.gardenTimesheetRepository.model.aggregate([
            {
                $match: {
                    date: {
                        $in: searchDates
                    },
                    status: constant_1.GardenTimesheetStatus.ACTIVE
                }
            },
            {
                $lookup: {
                    from: 'gardens',
                    localField: 'gardenId',
                    foreignField: '_id',
                    as: 'gardens',
                    pipeline: [
                        {
                            $match: {
                                status: constant_1.GardenStatus.ACTIVE
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    gardens: {
                        $exists: true,
                        $ne: []
                    }
                }
            },
            {
                $group: {
                    _id: '$gardenId',
                    timesheets: {
                        $push: '$$ROOT'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        this.appLogger.debug(`groupGardenTimesheets.length=${groupGardenTimesheets.length}`);
        this.appLogger.debug(`totalNumberOfDays=${duration * weekdays.length}`);
        this.appLogger.debug(`searchDates.length=${searchDates.length}`);
        const availableGroupGardenTimesheets = [];
        const unavailableGroupGardenTimesheets = [];
        groupGardenTimesheets.forEach((groupGardenTimesheet) => {
            if (groupGardenTimesheet.count === searchDates.length) {
                availableGroupGardenTimesheets.push(groupGardenTimesheet);
            }
            else {
                unavailableGroupGardenTimesheets.push(groupGardenTimesheet);
            }
        });
        if (availableGroupGardenTimesheets.length === 0)
            return { slotNumbers: [] };
        this.appLogger.debug(`availableGroupGardenTimesheets.length=${availableGroupGardenTimesheets.length}`);
        let availableTimeOfGardens = [];
        let availableTime = [];
        let notAvailableSlots = new Set();
        for (const unavailableGroupGardenTimesheet of unavailableGroupGardenTimesheets) {
            for (const gardenTimesheet of unavailableGroupGardenTimesheet.timesheets) {
                const slots = gardenTimesheet.slots;
                if (slots?.length !== 0) {
                    const groupSlots = _.groupBy(slots, 'slotNumber');
                    constant_1.SLOT_NUMBERS.forEach((slotNumber) => {
                        const groupSlot = _.get(groupSlots, slotNumber);
                        const isSlotBusyByInstructor = groupSlot &&
                            groupSlot?.length > 0 &&
                            groupSlot.find((slot) => slot.instructorId?.toString() === instructorId?.toString()) !== undefined;
                        if (isSlotBusyByInstructor) {
                            notAvailableSlots.add(slotNumber);
                        }
                    });
                }
            }
        }
        for (const availableGroupGardenTimesheet of availableGroupGardenTimesheets) {
            let availableGardenSlots = constant_1.SLOT_NUMBERS;
            for (const gardenTimesheet of availableGroupGardenTimesheet.timesheets) {
                const slots = gardenTimesheet.slots;
                if (slots?.length !== 0) {
                    const groupSlots = _.groupBy(slots, 'slotNumber');
                    const tempAvailableGardenSlots = [];
                    constant_1.SLOT_NUMBERS.forEach((slotNumber) => {
                        const groupSlot = _.get(groupSlots, slotNumber);
                        const isSlotBusyByInstructor = groupSlot &&
                            groupSlot?.length > 0 &&
                            groupSlot.find((slot) => slot.instructorId?.toString() === instructorId?.toString()) !== undefined;
                        if (isSlotBusyByInstructor) {
                            notAvailableSlots.add(slotNumber);
                        }
                        if (!groupSlot || groupSlot?.length < gardenTimesheet.gardenMaxClass || !isSlotBusyByInstructor) {
                            tempAvailableGardenSlots.push(slotNumber);
                        }
                    });
                    availableGardenSlots = _.intersection(tempAvailableGardenSlots, availableGardenSlots);
                }
            }
            availableTimeOfGardens.push({ slotNumbers: availableGardenSlots, gardenId: availableGroupGardenTimesheet._id });
            availableTime = [...new Set([...availableTime, ...availableGardenSlots])];
        }
        const notAvailableSlotsByInstructor = [...notAvailableSlots];
        availableTime = availableTime.filter((slotNumber) => [...notAvailableSlots].includes(slotNumber) === false);
        this.appLogger.log(`notAvailableSlotsByInstructor=${notAvailableSlotsByInstructor}`);
        this.appLogger.log(`availableTimeOfDates=${JSON.stringify(availableTimeOfGardens)}`);
        this.appLogger.log(`availableTime=${availableTime}`);
        return { slotNumbers: availableTime, availableTimeOfGardens, notAvailableSlotsByInstructor };
    }
    async generateSlotsForClass(params, options) {
        const { startDate, duration, weekdays, slotNumbers, gardenId, instructorId, classId, metadata, courseData } = params;
        this.appLogger.debug(`generateSlotsForClass: startDate=${startDate}, duration=${duration}, weekdays=${weekdays}, slotNumbers=${slotNumbers}, gardenId=${gardenId}, instructorId=${instructorId}, classId=${classId}`);
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
        const gardenTimesheets = await this.gardenTimesheetRepository.findMany({
            conditions: {
                date: { $in: classDates },
                status: constant_1.GardenTimesheetStatus.ACTIVE,
                gardenId
            },
            sort: { date: 1 }
        });
        this.appLogger.debug(`generateSlotsForClass: totalNumberOfDays=${duration * weekdays.length}`);
        this.appLogger.debug(`generateSlotsForClass: classDates.length=${classDates.length}`);
        this.appLogger.debug(`generateSlotsForClass: gardenTimesheets.length=${gardenTimesheets.length}`);
        const updateGardenTimesheetPromises = [];
        gardenTimesheets.forEach((gardenTimesheet, index) => {
            const session = courseData.sessions[index];
            const newSlots = slotNumbers.map((slotNumber) => new slot_dto_1.CreateSlotDto(slotNumber, gardenTimesheet.date, instructorId, new mongoose_1.Types.ObjectId(session._id), classId, {
                ...metadata,
                sessionNumber: session?.sessionNumber,
                sessionTitle: session?.title
            }));
            const totalSlots = [...gardenTimesheet.slots, ...newSlots].sort((a, b) => a.slotNumber - b.slotNumber);
            updateGardenTimesheetPromises.push(this.update({ _id: gardenTimesheet._id }, {
                slots: totalSlots
            }, options));
        });
        await Promise.all(updateGardenTimesheetPromises);
        return true;
    }
    async findMany(conditions, projection, populates) {
        const gardenTimesheets = await this.gardenTimesheetRepository.findMany({
            conditions,
            projection,
            populates
        });
        return gardenTimesheets;
    }
    async updateMany(conditions, payload, options) {
        await this.gardenTimesheetRepository.updateMany(conditions, payload, options);
    }
    async generateTimesheetOfMonth(gardenId, date, gardenMaxClass) {
        const startOfMonth = moment(date).tz(config_1.VN_TIMEZONE).startOf('month');
        const endOfMonth = moment(date).tz(config_1.VN_TIMEZONE).endOf('month');
        const monthTimesheet = [];
        let currentDate = startOfMonth.clone();
        while (currentDate.isSameOrBefore(endOfMonth)) {
            const gardenTimesheet = new create_garden_timesheet_dto_1.CreateGardenTimesheetDto(new mongoose_1.Types.ObjectId(gardenId), currentDate.toDate(), gardenMaxClass);
            monthTimesheet.push(gardenTimesheet);
            currentDate.add(1, 'day');
        }
        await this.gardenTimesheetRepository.model.insertMany(monthTimesheet);
    }
    async generateAllTimesheetOfMonth(date) {
        this.appLogger.log(`generateAllTimesheetOfMonth: ${date.toISOString()}`);
        const dateMoment = moment(date).tz(config_1.VN_TIMEZONE);
        const gardens = await this.gardenRepository.findMany({
            conditions: { status: constant_1.GardenStatus.ACTIVE }
        });
        const gardenIds = gardens.map((garden) => garden._id);
        const existedGardenTimesheets = await this.gardenTimesheetRepository.findMany({
            conditions: {
                date: dateMoment.clone().startOf('month'),
                gardenId: {
                    $in: gardenIds
                }
            }
        });
        this.appLogger.log(`existedGardenTimesheets.length: ${existedGardenTimesheets.length}`);
        this.appLogger.log(`gardenIds.length: ${gardenIds.length}`);
        if (existedGardenTimesheets.length < gardenIds.length) {
            console.time(`generateAllTimesheetOfMonth: date=${date.toISOString()}`);
            const generateTimesheetPromises = [];
            const existedGardenTimesheetGardenIds = existedGardenTimesheets.map((gardenTimesheet) => gardenTimesheet.gardenId.toString());
            gardens
                .filter((garden) => existedGardenTimesheetGardenIds.includes(garden._id.toString()) === false)
                .forEach((garden) => {
                generateTimesheetPromises.push(this.generateTimesheetOfMonth(garden._id, date, garden.maxClass));
            });
            await Promise.all(generateTimesheetPromises);
            console.timeEnd(`generateAllTimesheetOfMonth: date=${date.toISOString()}`);
        }
    }
    async generateAllTimesheetFromDateRange(startOfDate, endOfDate) {
        const generateAllTimesheetPromises = [];
        let currentDate = startOfDate.clone().startOf('month');
        while (currentDate.isSameOrBefore(endOfDate)) {
            generateAllTimesheetPromises.push(this.generateAllTimesheetOfMonth(currentDate.clone().toDate()));
            currentDate.add(1, 'month');
        }
        await Promise.all(generateAllTimesheetPromises);
    }
    transformDataToCalendar(timesheets) {
        const calendars = [];
        for (const timesheet of timesheets) {
            if (timesheet.status === constant_1.GardenTimesheetStatus.INACTIVE) {
                const startOfDate = moment(timesheet.date).tz(config_1.VN_TIMEZONE).startOf('date');
                const endOfDate = moment(timesheet.date).tz(config_1.VN_TIMEZONE).endOf('date');
                _.set(timesheet, 'start', startOfDate);
                _.set(timesheet, 'end', endOfDate);
                _.unset(timesheet, 'date');
                _.unset(timesheet, 'slots');
                calendars.push(timesheet);
            }
            else {
                for (const slot of timesheet.slots) {
                    if (slot.status === constant_1.SlotStatus.NOT_AVAILABLE) {
                        _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass);
                        calendars.push(slot);
                    }
                }
            }
        }
        return calendars;
    }
    transformDataToTeachingCalendar(timesheets, instructorId) {
        const calendars = [];
        for (const timesheet of timesheets) {
            for (const slot of timesheet.slots) {
                if (slot.status === constant_1.SlotStatus.NOT_AVAILABLE && slot.instructorId.toString() === instructorId) {
                    _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass);
                    calendars.push(slot);
                }
            }
        }
        return calendars;
    }
    transformDataToMyCalendar(timesheets, classIds) {
        const calendars = [];
        for (const timesheet of timesheets) {
            for (const slot of timesheet.slots) {
                if (slot.status === constant_1.SlotStatus.NOT_AVAILABLE && classIds.includes(slot.classId.toString())) {
                    _.set(slot, 'gardenMaxClass', timesheet.gardenMaxClass);
                    calendars.push(slot);
                }
            }
        }
        return calendars;
    }
};
exports.GardenTimesheetService = GardenTimesheetService;
exports.GardenTimesheetService = GardenTimesheetService = GardenTimesheetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(garden_timesheet_repository_1.IGardenTimesheetRepository)),
    __param(1, (0, common_1.Inject)(garden_repository_1.IGardenRepository)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => class_service_1.IClassService))),
    __param(4, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [Object, Object, helper_service_1.HelperService, Object, Object])
], GardenTimesheetService);
//# sourceMappingURL=garden-timesheet.service.js.map