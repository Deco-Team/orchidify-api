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
var QueueProducerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueProducerService = exports.IQueueProducerService = void 0;
const constant_1 = require("../../common/contracts/constant");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
const bullmq_2 = require("bullmq");
exports.IQueueProducerService = Symbol('IQueueProducerService');
let QueueProducerService = QueueProducerService_1 = class QueueProducerService {
    constructor(classRequestQueue, payoutRequestQueue, recruitmentQueue, classQueue, slotQueue) {
        this.classRequestQueue = classRequestQueue;
        this.payoutRequestQueue = payoutRequestQueue;
        this.recruitmentQueue = recruitmentQueue;
        this.classQueue = classQueue;
        this.slotQueue = slotQueue;
        this.appLogger = new app_logger_service_1.AppLogger(QueueProducerService_1.name);
    }
    async onModuleInit() {
        if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test') {
            await this.scheduleUpdateClassStatusJob();
            await this.scheduleUpdateClassProgressJob();
            await this.scheduleAutoCompleteClassJob();
            await this.scheduleSendClassCertificateJob();
            await this.scheduleRemindClassStartSlotJob();
            await this.scheduleRemindClassStartSoonJob();
        }
        this.queueMap = new Map();
        this.queueMap.set(constant_2.QueueName.CLASS_REQUEST, this.classRequestQueue);
        this.queueMap.set(constant_2.QueueName.PAYOUT_REQUEST, this.payoutRequestQueue);
        this.queueMap.set(constant_2.QueueName.RECRUITMENT, this.recruitmentQueue);
        this.queueMap.set(constant_2.QueueName.CLASS, this.classQueue);
        this.queueMap.set(constant_2.QueueName.SLOT, this.slotQueue);
        if ((await this.classRequestQueue.client).status !== 'ready') {
            throw Error('Redis service is not ready....');
        }
        this.appLogger.log(`Redis service is ready....`);
        this.countDelayedJobs();
        this.countJobSchedulers();
    }
    async onModuleDestroy() {
        await this.classRequestQueue.close();
        await this.payoutRequestQueue.close();
        await this.recruitmentQueue.close();
        await this.classQueue.close();
        await this.slotQueue.close();
    }
    async addJob(queueName, jobName, data, opts) {
        const queue = this.queueMap.get(queueName);
        if (!queue)
            throw new Error('Queue not found');
        const job = await queue.add(jobName, data, {
            backoff: 5000,
            ...opts
        });
        this.appLogger.debug(`Published job: jobId: ${job.id}, jobName: ${jobName} to queue: ${queueName}`);
        return job;
    }
    async getJob(queueName, jobId) {
        return this.queueMap.get(constant_2.QueueName[queueName]).getJob(jobId);
    }
    async removeJob(queueName, jobId) {
        try {
            this.appLogger.debug(`Remove Job: jobId: ${jobId} from queue: ${queueName}`);
            await this.queueMap.get(constant_2.QueueName[queueName]).remove(jobId);
        }
        catch (error) {
            this.appLogger.error(`Remove Job: [error] ${JSON.stringify(error)}`);
        }
    }
    async countDelayedJobs() {
        this.appLogger.debug(`Queue: ${constant_2.QueueName.PAYOUT_REQUEST}: Delayed Jobs Count = ${await this.payoutRequestQueue.getDelayedCount()}`);
        this.appLogger.debug(`Queue: ${constant_2.QueueName.RECRUITMENT}: Delayed Jobs Count = ${await this.recruitmentQueue.getDelayedCount()}`);
        this.appLogger.debug(`Queue: ${constant_2.QueueName.CLASS}: Delayed Jobs Count = ${await this.classQueue.getDelayedCount()}`);
        this.appLogger.debug(`Queue: ${constant_2.QueueName.SLOT}: Delayed Jobs Count = ${await this.slotQueue.getDelayedCount()}`);
    }
    async countJobSchedulers() {
        this.appLogger.debug(`Queue: ${constant_2.QueueName.CLASS}: Scheduler Jobs Count = ${(await this.classQueue.getJobSchedulers()).length}`);
    }
    async scheduleUpdateClassStatusJob() {
        await this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.UpdateClassStatusScheduler, {
            pattern: '0 0 * * *',
            tz: config_1.VN_TIMEZONE
        }, {
            name: constant_2.JobName.UpdateClassStatus
        });
    }
    async scheduleUpdateClassProgressJob() {
        await Promise.all([
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.UpdateClassProgressEndSlot1Scheduler, {
                pattern: '0 9 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.UpdateClassProgressEndSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.ONE
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.UpdateClassProgressEndSlot2Scheduler, {
                pattern: '30 11 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.UpdateClassProgressEndSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.TWO
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.UpdateClassProgressEndSlot3Scheduler, {
                pattern: '0 15 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.UpdateClassProgressEndSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.THREE
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.UpdateClassProgressEndSlot4Scheduler, {
                pattern: '30 17 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.UpdateClassProgressEndSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.FOUR
                }
            })
        ]);
    }
    async scheduleAutoCompleteClassJob() {
        await this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.CompleteClassScheduler, {
            pattern: '0 6 * * *',
            tz: config_1.VN_TIMEZONE
        }, {
            name: constant_2.JobName.ClassAutoCompleted
        });
    }
    async scheduleSendClassCertificateJob() {
        await this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.SendClassCertificateScheduler, {
            pattern: '30 7 * * *',
            tz: config_1.VN_TIMEZONE
        }, {
            name: constant_2.JobName.SendClassCertificate
        });
    }
    async scheduleRemindClassStartSlotJob() {
        await Promise.all([
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.RemindClassStartSlot1Scheduler, {
                pattern: '0 6 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.RemindClassStartSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.ONE
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.RemindClassStartSlot2Scheduler, {
                pattern: '30 8 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.RemindClassStartSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.TWO
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.RemindClassStartSlot3Scheduler, {
                pattern: '0 12 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.RemindClassStartSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.THREE
                }
            }),
            this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.RemindClassStartSlot4Scheduler, {
                pattern: '30 14 * * *',
                tz: config_1.VN_TIMEZONE
            }, {
                name: constant_2.JobName.RemindClassStartSlot,
                data: {
                    slotNumber: constant_1.SlotNumber.FOUR
                }
            })
        ]);
    }
    async scheduleRemindClassStartSoonJob() {
        await this.classQueue.upsertJobScheduler(constant_2.JobSchedulerKey.RemindClassStartSoonScheduler, {
            pattern: '00 8 * * *',
            tz: config_1.VN_TIMEZONE
        }, {
            name: constant_2.JobName.RemindClassStartSoon
        });
    }
};
exports.QueueProducerService = QueueProducerService;
exports.QueueProducerService = QueueProducerService = QueueProducerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(constant_2.QueueName.CLASS_REQUEST)),
    __param(1, (0, bullmq_1.InjectQueue)(constant_2.QueueName.PAYOUT_REQUEST)),
    __param(2, (0, bullmq_1.InjectQueue)(constant_2.QueueName.RECRUITMENT)),
    __param(3, (0, bullmq_1.InjectQueue)(constant_2.QueueName.CLASS)),
    __param(4, (0, bullmq_1.InjectQueue)(constant_2.QueueName.SLOT)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], QueueProducerService);
//# sourceMappingURL=queue-producer.service.js.map