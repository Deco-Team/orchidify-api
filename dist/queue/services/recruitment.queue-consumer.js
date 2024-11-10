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
var RecruitmentQueueConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentQueueConsumer = void 0;
const moment = require("moment-timezone");
const error_1 = require("../../common/contracts/error");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const constant_1 = require("../contracts/constant");
const config_1 = require("../../config");
const recruitment_service_1 = require("../../recruitment/services/recruitment.service");
let RecruitmentQueueConsumer = RecruitmentQueueConsumer_1 = class RecruitmentQueueConsumer extends bullmq_1.WorkerHost {
    constructor(recruitmentService) {
        super();
        this.recruitmentService = recruitmentService;
        this.appLogger = new app_logger_service_1.AppLogger(RecruitmentQueueConsumer_1.name);
    }
    async process(job) {
        this.appLogger.log(`[process] Processing job id=${job.id}`);
        try {
            switch (job.name) {
                case constant_1.JobName.RecruitmentAutoExpired: {
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
            return 'Recruitment not expired yet';
        try {
            this.appLogger.log(`[updateStatusToExpired]: Start update status... id=${job.id}`);
            const recruitment = await this.recruitmentService.findById(job.id);
            if (!recruitment)
                return error_1.Errors.RECRUITMENT_NOT_FOUND.error;
            await this.recruitmentService.expiredRecruitmentProcess(job.id, { role: 'SYSTEM' });
            this.appLogger.log(`[updateStatusToExpired]: End update status... id=${job.id}`);
            return true;
        }
        catch (error) {
            this.appLogger.error(`[updateStatusToExpired]: error id=${job.id}, name=${job.name}, data=${JSON.stringify(job.data)}, error=${error}`);
            return false;
        }
    }
};
exports.RecruitmentQueueConsumer = RecruitmentQueueConsumer;
exports.RecruitmentQueueConsumer = RecruitmentQueueConsumer = RecruitmentQueueConsumer_1 = __decorate([
    (0, bullmq_1.Processor)(constant_1.QueueName.RECRUITMENT),
    __param(0, (0, common_1.Inject)(recruitment_service_1.IRecruitmentService)),
    __metadata("design:paramtypes", [Object])
], RecruitmentQueueConsumer);
//# sourceMappingURL=recruitment.queue-consumer.js.map