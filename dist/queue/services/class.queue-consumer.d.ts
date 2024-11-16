import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IClassService } from '@class/services/class.service';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { ISettingService } from '@setting/services/setting.service';
import { Class } from '@class/schemas/class.schema';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { HelperService } from '@common/services/helper.service';
import { MediaService } from '@media/services/media.service';
import { ICertificateService } from '@certificate/services/certificate.service';
import { IAttendanceService } from '@attendance/services/attendance.service';
import { IAssignmentSubmissionService } from '@class/services/assignment-submission.service';
export declare class ClassQueueConsumer extends WorkerHost {
    private readonly helperService;
    private readonly mediaService;
    private readonly classService;
    private readonly gardenTimesheetService;
    private readonly settingService;
    private readonly learnerClassService;
    private readonly certificateService;
    private readonly attendanceService;
    private readonly assignmentSubmissionService;
    private readonly appLogger;
    constructor(helperService: HelperService, mediaService: MediaService, classService: IClassService, gardenTimesheetService: IGardenTimesheetService, settingService: ISettingService, learnerClassService: ILearnerClassService, certificateService: ICertificateService, attendanceService: IAttendanceService, assignmentSubmissionService: IAssignmentSubmissionService);
    process(job: Job<any>): Promise<any>;
    updateClassStatus(job: Job): Promise<false | "No PUBLISHED status class" | {
        status: boolean;
        updateClassToInProgress: any[];
        updateClassToCanceled: any[];
    }>;
    updateClassProgressEndSlot(job: Job): Promise<false | {
        status: boolean;
        numbersOfUpdatedClass: number;
    }>;
    completeClassAutomatically(job: Job): Promise<false | {
        status: boolean;
        numbersOfCompletedClass: number;
    }>;
    sendClassCertificate(job: Job): Promise<false | {
        status: boolean;
        numbersOfHasSentCertificateClass: number;
    }>;
    generateCertificateForClass(courseClass: Class): Promise<void>;
}
