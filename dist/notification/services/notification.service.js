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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.INotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_repository_1 = require("../repositories/notification.repository");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const firebase_auth_service_1 = require("../../firebase/services/firebase.auth.service");
exports.INotificationService = Symbol('INotificationService');
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(notificationRepository, firebaseService) {
        this.notificationRepository = notificationRepository;
        this.firebaseService = firebaseService;
        this.appLogger = new app_logger_service_1.AppLogger(NotificationService_1.name);
    }
    async create(createNotificationDto, options) {
        return await this.notificationRepository.create({ ...createNotificationDto }, options);
    }
    async update(conditions, payload, options) {
        return await this.notificationRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findById(notificationId, projection, populates) {
        const notification = await this.notificationRepository.findOne({
            conditions: {
                _id: notificationId
            },
            projection,
            populates
        });
        return notification;
    }
    async findOneBy(conditions, projection, populates) {
        const notification = await this.notificationRepository.findOne({
            conditions,
            projection,
            populates
        });
        return notification;
    }
    async findMany(conditions, projection, populates) {
        const notifications = await this.notificationRepository.findMany({
            conditions,
            projection,
            populates
        });
        return notifications;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(notification_repository_1.INotificationRepository)),
    __param(1, (0, common_1.Inject)(firebase_auth_service_1.IFirebaseAuthService)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map