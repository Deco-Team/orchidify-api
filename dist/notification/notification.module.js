"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_service_1 = require("./services/notification.service");
const user_device_service_1 = require("./services/user-device.service");
const user_device_repository_1 = require("./repositories/user-device.repository");
const user_device_controller_1 = require("./controllers/user-device.controller");
const firebase_module_1 = require("../firebase/firebase.module");
const user_device_schema_1 = require("./schemas/user-device.schema");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_device_schema_1.UserDevice.name, schema: user_device_schema_1.UserDeviceSchema }
            ]),
            firebase_module_1.FirebaseModule
        ],
        controllers: [user_device_controller_1.UserDeviceController],
        providers: [
            {
                provide: notification_service_1.INotificationService,
                useClass: notification_service_1.NotificationService
            },
            {
                provide: user_device_service_1.IUserDeviceService,
                useClass: user_device_service_1.UserDeviceService
            },
            {
                provide: user_device_repository_1.IUserDeviceRepository,
                useClass: user_device_repository_1.UserDeviceRepository
            }
        ],
        exports: [
            {
                provide: notification_service_1.INotificationService,
                useClass: notification_service_1.NotificationService
            },
            {
                provide: user_device_service_1.IUserDeviceService,
                useClass: user_device_service_1.UserDeviceService
            }
        ]
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map