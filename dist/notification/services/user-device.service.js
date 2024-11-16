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
var UserDeviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceService = exports.IUserDeviceService = void 0;
const common_1 = require("@nestjs/common");
const user_device_repository_1 = require("../repositories/user-device.repository");
const app_logger_service_1 = require("../../common/services/app-logger.service");
exports.IUserDeviceService = Symbol('IUserDeviceService');
let UserDeviceService = UserDeviceService_1 = class UserDeviceService {
    constructor(userDeviceRepository) {
        this.userDeviceRepository = userDeviceRepository;
        this.appLogger = new app_logger_service_1.AppLogger(UserDeviceService_1.name);
    }
    async create(createUserDeviceDto, options) {
        return await this.userDeviceRepository.create({ ...createUserDeviceDto }, options);
    }
    async update(conditions, payload, options) {
        return await this.userDeviceRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findById(userDeviceId, projection, populates) {
        const userDevice = await this.userDeviceRepository.findOne({
            conditions: {
                _id: userDeviceId
            },
            projection,
            populates
        });
        return userDevice;
    }
    async findByFcmToken(fcmToken, projection, populates) {
        const userDevice = await this.userDeviceRepository.findOne({
            conditions: {
                fcmToken
            },
            projection,
            populates
        });
        return userDevice;
    }
    async findOneBy(conditions, projection, populates) {
        const userDevice = await this.userDeviceRepository.findOne({
            conditions,
            projection,
            populates
        });
        return userDevice;
    }
    async findMany(conditions, projection, populates) {
        const userDevices = await this.userDeviceRepository.findMany({
            conditions,
            projection,
            populates
        });
        return userDevices;
    }
};
exports.UserDeviceService = UserDeviceService;
exports.UserDeviceService = UserDeviceService = UserDeviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_device_repository_1.IUserDeviceRepository)),
    __metadata("design:paramtypes", [Object])
], UserDeviceService);
//# sourceMappingURL=user-device.service.js.map