import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IClassService } from '@class/services/class.service';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { ISettingService } from '@setting/services/setting.service';
export declare class ClassQueueConsumer extends WorkerHost {
    private readonly classService;
    private readonly gardenTimesheetService;
    private readonly settingService;
    private readonly appLogger;
    constructor(classService: IClassService, gardenTimesheetService: IGardenTimesheetService, settingService: ISettingService);
    process(job: Job<any>): Promise<any>;
    updateClassStatusInProgress(job: Job): Promise<false | "No PUBLISHED status class" | {
        status: boolean;
        numbersOfUpdatedClass: number;
    }>;
    updateClassProgressEndSlot(job: Job): Promise<false | {
        status: boolean;
        numbersOfUpdatedClass: number;
    }>;
    completeClassAutomatically(job: Job): Promise<false | {
        status: boolean;
        numbersOfCompletedClass: number;
    }>;
}
