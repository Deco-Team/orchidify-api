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
import { INotificationService } from '@notification/services/notification.service';
import { IGardenService } from '@garden/services/garden.service';
import { IReportService } from '@report/services/report.service';
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
    private readonly notificationService;
    private readonly gardenService;
    private readonly reportService;
    private readonly appLogger;
    constructor(helperService: HelperService, mediaService: MediaService, classService: IClassService, gardenTimesheetService: IGardenTimesheetService, settingService: ISettingService, learnerClassService: ILearnerClassService, certificateService: ICertificateService, attendanceService: IAttendanceService, assignmentSubmissionService: IAssignmentSubmissionService, notificationService: INotificationService, gardenService: IGardenService, reportService: IReportService);
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
    remindClassStartSlot(job: Job): Promise<false | {
        status: boolean;
        classIds: unknown[];
    }>;
    private sendClassSlotStartRemindNotificationForLearner;
    remindClassStartSoon(job: Job): Promise<false | "No PUBLISHED status class" | {
        status: boolean;
        classIds: any[];
    }>;
    private sendClassStartSoonRemindNotification;
}
