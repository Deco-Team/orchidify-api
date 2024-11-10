import { IClassRequestService } from '@class-request/services/class-request.service';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class ClassRequestQueueConsumer extends WorkerHost {
    private readonly classRequestService;
    private readonly appLogger;
    constructor(classRequestService: IClassRequestService);
    process(job: Job<any>): Promise<any>;
    updateStatusToExpired(job: Job): Promise<string | boolean>;
}
