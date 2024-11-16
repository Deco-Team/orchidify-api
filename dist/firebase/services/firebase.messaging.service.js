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
const instructor_service_1 = require("../../instructor/services/instructor.service");
const learner_service_1 = require("../../learner/services/learner.service");
exports.IFirebaseMessagingService = Symbol('IFirebaseMessagingService');
let FirebaseMessagingService = FirebaseMessagingService_1 = class FirebaseMessagingService {
    constructor(firebaseRepository, instructorService, learnerService) {
        this.firebaseRepository = firebaseRepository;
        this.instructorService = instructorService;
        this.learnerService = learnerService;
        this.appLogger = new app_logger_service_1.AppLogger(FirebaseMessagingService_1.name);
    }
    async send({ token, title, body, icon }) {
        try {
            const response = await this.firebaseRepository.getMessaging().send({
                token,
                notification: {
                    title,
                    body,
                },
            });
            return {
                success: true,
                response
            };
        }
        catch (error) {
            console.log('Error sending messages:', error);
            return { success: false };
        }
    }
    async sendMulticast({ tokens, title, body, icon }) {
        const message = {
            notification: {
                title,
                body,
                icon
            },
            tokens
        };
        try {
            const response = await this.firebaseRepository.getMessaging().sendEachForMulticast(message);
            console.log('Successfully sent messages:', response);
            return {
                success: true,
                response
            };
        }
        catch (error) {
            console.log('Error sending messages:', error);
            return { success: false };
        }
    }
    async sendTopicNotification({ topic, title, body, icon }) {
        const message = {
            notification: {
                title,
                body,
                icon
            },
            topic
        };
        try {
            const response = await this.firebaseRepository.getMessaging().send(message);
            console.log('Successfully sent message:', response);
            return { success: true, response };
        }
        catch (error) {
            console.log('Error sending message:', error);
            return { success: false };
        }
    }
};
exports.FirebaseMessagingService = FirebaseMessagingService;
exports.FirebaseMessagingService = FirebaseMessagingService = FirebaseMessagingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(firebase_repository_1.IFirebaseRepository)),
    __param(1, (0, common_1.Inject)(instructor_service_1.IInstructorService)),
    __param(2, (0, common_1.Inject)(learner_service_1.ILearnerService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], FirebaseMessagingService);
//# sourceMappingURL=firebase.messaging.service.js.map