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
var NotificationAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAdapter = void 0;
const app_logger_service_1 = require("../services/app-logger.service");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let NotificationAdapter = NotificationAdapter_1 = class NotificationAdapter {
    constructor(mailService) {
        this.mailService = mailService;
        this._appLogger = new app_logger_service_1.AppLogger(NotificationAdapter_1.name);
    }
    async sendMail(options) {
        try {
            this._appLogger.log(`[${NotificationAdapter_1.name}] [success] data= ${JSON.stringify(options)}`);
            await this.mailService.sendMail(options);
        }
        catch (error) {
            this._appLogger.error(`[${NotificationAdapter_1.name}] [failed] error = ${JSON.stringify(error.message)}`);
        }
    }
};
exports.NotificationAdapter = NotificationAdapter;
exports.NotificationAdapter = NotificationAdapter = NotificationAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], NotificationAdapter);
//# sourceMappingURL=notification.adapter.js.map