import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IRecruitmentService } from '@recruitment/services/recruitment.service';
export declare class RecruitmentQueueConsumer extends WorkerHost {
    private readonly recruitmentService;
    private readonly appLogger;
    constructor(recruitmentService: IRecruitmentService);
    process(job: Job<any>): Promise<any>;
    updateStatusToExpired(job: Job): Promise<string | boolean>;
}
