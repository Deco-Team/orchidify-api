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
var ClassRequestQueueConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRequestQueueConsumer = void 0;
const moment = require("moment-timezone");
const class_request_service_1 = require("../../class-request/services/class-request.service");
const constant_1 = require("../../common/contracts/constant");
const error_1 = require("../../common/contracts/error");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
let ClassRequestQueueConsumer = ClassRequestQueueConsumer_1 = class ClassRequestQueueConsumer extends bullmq_1.WorkerHost {
    constructor(classRequestService) {
        super();
        this.classRequestService = classRequestService;
        this.appLogger = new app_logger_service_1.AppLogger(ClassRequestQueueConsumer_1.name);
    }
    async process(job) {
        this.appLogger.log(`[process] Processing job id=${job.id}`);
        try {
            switch (job.name) {
                case constant_2.JobName.ClassRequestAutoExpired: {
                    return await this.updateStatusToExpired(job);
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
    async updateStatusToExpired(job) {
        this.appLogger.debug(`[updateStatusToExpired]: id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}`);
        const { expiredAt } = job.data;
        const isExpired = moment.tz(config_1.VN_TIMEZONE).isSameOrAfter(moment.tz(expiredAt, config_1.VN_TIMEZONE));
        if (!isExpired)
            return 'Class Request not expired yet';
        try {
            this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`);
            const classRequest = await this.classRequestService.findById(job.id);
            if (!classRequest)
                return error_1.Errors.CLASS_REQUEST_NOT_FOUND.error;
            if (classRequest.type === constant_1.ClassRequestType.PUBLISH_CLASS) {
                await this.classRequestService.expirePublishClassRequest(job.id, { role: 'SYSTEM' });
            }
            else if (classRequest.type === constant_1.ClassRequestType.CANCEL_CLASS) {
                await this.classRequestService.expireCancelClassRequest(job.id, { role: 'SYSTEM' });
            }
            this.appLogger.log(`[updateStatusToExpired]: End update status... id=${job.id}`);
            return true;
        }
        catch (error) {
            this.appLogger.error(`[updateStatusToExpired]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
};
exports.ClassRequestQueueConsumer = ClassRequestQueueConsumer;
exports.ClassRequestQueueConsumer = ClassRequestQueueConsumer = ClassRequestQueueConsumer_1 = __decorate([
    (0, bullmq_1.Processor)(constant_2.QueueName.CLASS_REQUEST),
    __param(0, (0, common_1.Inject)(class_request_service_1.IClassRequestService)),
    __metadata("design:paramtypes", [Object])
], ClassRequestQueueConsumer);
//# sourceMappingURL=class-request.queue-consumer.js.map