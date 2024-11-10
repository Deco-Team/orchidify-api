"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constant_1 = require("./contracts/constant");
const class_request_queue_consumer_1 = require("./services/class-request.queue-consumer");
const queue_producer_service_1 = require("./services/queue-producer.service");
const class_queue_consumer_1 = require("./services/class.queue-consumer");
const recruitment_module_1 = require("../recruitment/recruitment.module");
const recruitment_queue_consumer_1 = require("./services/recruitment.queue-consumer");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                useFactory: (configService) => ({
                    connection: configService.get('redis'),
                    prefix: 'orchidify',
                    defaultJobOptions: {
                        attempts: 3
                    }
                }),
                inject: [config_1.ConfigService]
            }),
            bullmq_1.BullModule.registerQueue({
                name: constant_1.QueueName.CLASS_REQUEST
            }, {
                name: constant_1.QueueName.PAYOUT_REQUEST
            }, {
                name: constant_1.QueueName.RECRUITMENT
            }, {
                name: constant_1.QueueName.CLASS
            }, {
                name: constant_1.QueueName.SLOT
            }),
            recruitment_module_1.RecruitmentModule
        ],
        controllers: [],
        providers: [
            class_request_queue_consumer_1.ClassRequestQueueConsumer,
            class_queue_consumer_1.ClassQueueConsumer,
            recruitment_queue_consumer_1.RecruitmentQueueConsumer,
            {
                provide: queue_producer_service_1.IQueueProducerService,
                useClass: queue_producer_service_1.QueueProducerService
            }
        ],
        exports: [
            {
                provide: queue_producer_service_1.IQueueProducerService,
                useClass: queue_producer_service_1.QueueProducerService
            }
        ]
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map