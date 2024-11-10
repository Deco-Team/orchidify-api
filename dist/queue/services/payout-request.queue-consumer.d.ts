import { IPayoutRequestService } from '@payout-request/services/payout-request.service';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class PayoutRequestQueueConsumer extends WorkerHost {
    private readonly payoutRequestService;
    private readonly appLogger;
    constructor(payoutRequestService: IPayoutRequestService);
    process(job: Job<any>): Promise<any>;
    updateStatusToExpired(job: Job): Promise<string | boolean>;
}
