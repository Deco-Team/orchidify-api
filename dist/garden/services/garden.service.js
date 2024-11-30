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
var GardenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenService = exports.IGardenService = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const garden_repository_1 = require("../repositories/garden.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../contracts/constant");
const constant_2 = require("../../common/contracts/constant");
const mongodb_1 = require("mongodb");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const garden_timesheet_service_1 = require("../../garden-timesheet/services/garden-timesheet.service");
const app_logger_service_1 = require("../../common/services/app-logger.service");
exports.IGardenService = Symbol('IGardenService');
let GardenService = GardenService_1 = class GardenService {
    constructor(gardenRepository, gardenTimesheetService) {
        this.gardenRepository = gardenRepository;
        this.gardenTimesheetService = gardenTimesheetService;
        this.appLogger = new app_logger_service_1.AppLogger(GardenService_1.name);
    }
    async create(createGardenDto, options) {
        try {
            return await this.gardenRepository.create({ ...createGardenDto, gardenManagerId: new mongoose_1.Types.ObjectId(createGardenDto.gardenManagerId) }, options);
        }
        catch (error) {
            if (error.name === mongodb_1.MongoServerError.name && error.code === 11000 && error.keyPattern?.['name'] === 1) {
                throw new app_exception_1.AppException(error_1.Errors.GARDEN_NAME_EXISTED);
            }
            throw error;
        }
    }
    async findById(gardenId, projection, populates) {
        const garden = await this.gardenRepository.findOne({
            conditions: {
                _id: gardenId
            },
            projection,
            populates
        });
        return garden;
    }
    async findOneBy(conditions, projection, populates) {
        const garden = await this.gardenRepository.findOne({
            conditions,
            projection,
            populates
        });
        return garden;
    }
    async update(conditions, payload, options) {
        try {
            if (payload.gardenManagerId) {
                payload.gardenManagerId = new mongoose_1.Types.ObjectId(payload.gardenManagerId);
            }
            return await this.gardenRepository.findOneAndUpdate(conditions, payload, options);
        }
        catch (error) {
            if (error.name === mongodb_1.MongoServerError.name && error.name === 11000 && error.name?.['name'] === 1) {
                throw new app_exception_1.AppException(error_1.Errors.GARDEN_NAME_EXISTED);
            }
            throw error;
        }
    }
    async findManyByGardenManagerId(gardenManagerId) {
        const gardens = await this.gardenRepository.findMany({
            conditions: {
                gardenManagerId: new mongoose_1.Types.ObjectId(gardenManagerId)
            }
        });
        return gardens;
    }
    async list(pagination, queryCourseDto, projection = constant_1.GARDEN_LIST_PROJECTION, populate) {
        const { name, address, status, gardenManagerId } = queryCourseDto;
        const filter = {};
        if (gardenManagerId) {
            filter['gardenManagerId'] = gardenManagerId;
        }
        const validStatus = status?.filter((status) => [constant_2.GardenStatus.ACTIVE, constant_2.GardenStatus.INACTIVE].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        let textSearch = '';
        if (name)
            textSearch += name.trim();
        if (address)
            textSearch += ' ' + address.trim();
        if (textSearch) {
            filter['$text'] = {
                $search: textSearch.trim()
            };
        }
        return this.gardenRepository.model.paginate(filter, {
            ...pagination,
            projection,
            populate
        });
    }
    async getAvailableGardenList(queryAvailableGardenDto) {
        const { startDate, duration, weekdays, slotNumbers, instructorId } = queryAvailableGardenDto;
        const availableSlots = await this.gardenTimesheetService.viewAvailableTime({
            startDate,
            duration,
            weekdays,
            instructorId
        });
        this.appLogger.log(`getAvailableGardenList: slotNumbers=${slotNumbers}, availableSlotNumbers=${availableSlots.slotNumbers}, availableTimeOfGardens=${JSON.stringify(availableSlots.availableTimeOfGardens)}`);
        if (_.difference(slotNumbers, availableSlots.slotNumbers).length !== 0)
            return [];
        const availableGardens = availableSlots.availableTimeOfGardens.filter((availableTimeOfGarden) => {
            this.appLogger.log(`gardenId=${availableTimeOfGarden.gardenId}, slotNumbers=${availableTimeOfGarden.slotNumbers}`);
            return _.difference(slotNumbers, availableTimeOfGarden.slotNumbers).length === 0;
        });
        if (availableGardens.length === 0)
            return [];
        const gardenIds = availableGardens.map((availableGarden) => availableGarden.gardenId);
        const gardens = await this.gardenRepository.findMany({
            conditions: {
                _id: {
                    $in: gardenIds
                },
                status: constant_2.GardenStatus.ACTIVE
            },
            projection: ['_id', 'name']
        });
        return gardens;
    }
};
exports.GardenService = GardenService;
exports.GardenService = GardenService = GardenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(garden_repository_1.IGardenRepository)),
    __param(1, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __metadata("design:paramtypes", [Object, Object])
], GardenService);
//# sourceMappingURL=garden.service.js.map