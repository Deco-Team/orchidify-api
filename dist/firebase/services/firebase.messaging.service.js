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
var FirebaseMessagingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseMessagingService = exports.IFirebaseMessagingService = void 0;
const common_1 = require("@nestjs/common");
const firebase_repository_1 = require("../repositories/firebase.repository");
const app_logger_service_1 = require("../../common/services/app-logger.service");
exports.IFirebaseMessagingService = Symbol('IFirebaseMessagingService');
let FirebaseMessagingService = FirebaseMessagingService_1 = class FirebaseMessagingService {
    constructor(firebaseRepository) {
        this.firebaseRepository = firebaseRepository;
        this.appLogger = new app_logger_service_1.AppLogger(FirebaseMessagingService_1.name);
    }
    async send({ token, title, body, data }) {
        try {
            const response = await this.firebaseRepository.getMessaging().send({
                token,
                notification: {
                    title,
                    body
                },
                data
            });
            return {
                success: true,
                response
            };
        }
        catch (error) {
            this.appLogger.error('Error sending messages:', error);
            return { success: false };
        }
    }
    async sendMulticast({ tokens, title, body, data }) {
        const message = {
            notification: {
                title,
                body
            },
            tokens,
            data
        };
        try {
            const response = await this.firebaseRepository.getMessaging().sendEachForMulticast(message);
            this.appLogger.log(`Successfully sent messages: ${JSON.stringify(response)}`);
            return {
                success: true,
                response
            };
        }
        catch (error) {
            this.appLogger.error('Error sending messages:', error);
            return { success: false };
        }
    }
    async sendTopicNotification({ topic, title, body, data }) {
        const message = {
            notification: {
                title,
                body
            },
            topic,
            data
        };
        try {
            const response = await this.firebaseRepository.getMessaging().send(message);
            this.appLogger.log(`Successfully sent messages: ${JSON.stringify(response)}`);
            return { success: true, response };
        }
        catch (error) {
            this.appLogger.error('Error sending message:', error);
            return { success: false };
        }
    }
    async subscribeToTopic({ topic, tokens }) {
        try {
            const response = await this.firebaseRepository.getMessaging().subscribeToTopic(tokens, topic);
            this.appLogger.log(`Successfully subscribed to topic: ${JSON.stringify(response)}`);
            return { success: true, response };
        }
        catch (error) {
            this.appLogger.error('Error subscribing to topic:', error);
            return { success: false };
        }
    }
    async unsubscribeToTopic({ topic, tokens }) {
        try {
            const response = await this.firebaseRepository.getMessaging().unsubscribeFromTopic(tokens, topic);
            this.appLogger.log(`Successfully unsubscribed to topic: ${JSON.stringify(response)}`);
            return { success: true, response };
        }
        catch (error) {
            this.appLogger.error('Error unsubscribing to topic:', error);
            return { success: false };
        }
    }
};
exports.FirebaseMessagingService = FirebaseMessagingService;
exports.FirebaseMessagingService = FirebaseMessagingService = FirebaseMessagingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(firebase_repository_1.IFirebaseRepository)),
    __metadata("design:paramtypes", [Object])
], FirebaseMessagingService);
//# sourceMappingURL=firebase.messaging.service.js.map