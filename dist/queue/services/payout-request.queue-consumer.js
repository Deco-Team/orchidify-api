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
var PayoutRequestQueueConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestQueueConsumer = void 0;
const moment = require("moment-timezone");
const payout_request_service_1 = require("../../payout-request/services/payout-request.service");
const error_1 = require("../../common/contracts/error");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const constant_1 = require("../contracts/constant");
const config_1 = require("../../config");
let PayoutRequestQueueConsumer = PayoutRequestQueueConsumer_1 = class PayoutRequestQueueConsumer extends bullmq_1.WorkerHost {
    constructor(payoutRequestService) {
        super();
        this.payoutRequestService = payoutRequestService;
        this.appLogger = new app_logger_service_1.AppLogger(PayoutRequestQueueConsumer_1.name);
    }
    async process(job) {
        this.appLogger.log(`[process] Processing job id=${job.id}`);
        try {
            switch (job.name) {
                case constant_1.JobName.PayoutRequestAutoExpired: {
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
            return 'Payout Request not expired yet';
        try {
            this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`);
            const payoutRequest = await this.payoutRequestService.findById(job.id);
            if (!payoutRequest)
                return error_1.Errors.CLASS_REQUEST_NOT_FOUND.error;
            await this.payoutRequestService.expirePayoutRequest(job.id, { role: 'SYSTEM' });
            this.appLogger.log(`[updateStatusToExpired]: End update status... id=${job.id}`);
            return true;
        }
        catch (error) {
            this.appLogger.error(`[updateStatusToExpired]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
};
exports.PayoutRequestQueueConsumer = PayoutRequestQueueConsumer;
exports.PayoutRequestQueueConsumer = PayoutRequestQueueConsumer = PayoutRequestQueueConsumer_1 = __decorate([
    (0, bullmq_1.Processor)(constant_1.QueueName.PAYOUT_REQUEST),
    __param(0, (0, common_1.Inject)(payout_request_service_1.IPayoutRequestService)),
    __metadata("design:paramtypes", [Object])
], PayoutRequestQueueConsumer);
//# sourceMappingURL=payout-request.queue-consumer.js.map