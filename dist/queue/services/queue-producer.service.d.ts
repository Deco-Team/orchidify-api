import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobName, QueueName } from '@queue/contracts/constant';
import { Job, JobsOptions, Queue } from 'bullmq';
export declare const IQueueProducerService: unique symbol;
export interface IQueueProducerService {
    addJob(queueName: QueueName, jobName: JobName, data: any, opts?: JobsOptions): Promise<Job>;
    getJob(queueName: QueueName, jobId: string): Promise<Job | null>;
    removeJob(queueName: QueueName, jobId: string): Promise<void>;
}
export declare class QueueProducerService implements IQueueProducerService, OnModuleInit, OnModuleDestroy {
    private readonly classRequestQueue;
    private readonly payoutRequestQueue;
    private readonly recruitmentQueue;
    private readonly classQueue;
    private readonly slotQueue;
    private readonly appLogger;
    private queueMap;
    constructor(classRequestQueue: Queue, payoutRequestQueue: Queue, recruitmentQueue: Queue, classQueue: Queue, slotQueue: Queue);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    addJob(queueName: QueueName, jobName: JobName, data: any, opts?: JobsOptions): Promise<Job>;
    getJob(queueName: QueueName, jobId: string): Promise<Job | null>;
    removeJob(queueName: QueueName, jobId: string): Promise<void>;
    private countDelayedJobs;
    private countJobSchedulers;
    private scheduleUpdateClassStatusJob;
    private scheduleUpdateClassProgressJob;
    private scheduleAutoCompleteClassJob;
    private scheduleSendClassCertificateJob;
    private scheduleRemindClassStartSlotJob;
    private scheduleRemindClassStartSoonJob;
}
