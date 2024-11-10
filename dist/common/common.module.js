"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const app_logger_service_1 = require("./services/app-logger.service");
const helper_service_1 = require("./services/helper.service");
const discord_service_1 = require("./services/discord.service");
const notification_adapter_1 = require("./adapters/notification.adapter");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [app_logger_service_1.AppLogger, helper_service_1.HelperService, discord_service_1.DiscordService, notification_adapter_1.NotificationAdapter],
        exports: [app_logger_service_1.AppLogger, helper_service_1.HelperService, discord_service_1.DiscordService, notification_adapter_1.NotificationAdapter]
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map