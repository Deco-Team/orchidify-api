import { IDResponse } from '@common/contracts/dto';
import { IClassService } from '@class/services/class.service';
import { IAssignmentService } from '@class/services/assignment.service';
import { ISessionService } from '@class/services/session.service';
import { EnrollClassDto } from '@class/dto/enroll-class.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassDto } from '@class/dto/view-class.dto';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { CreateAssignmentSubmissionDto } from '@class/dto/assignment-submission.dto';
import { IAssignmentSubmissionService } from '@class/services/assignment-submission.service';
import { IFeedbackService } from '@feedback/services/feedback.service';
export declare class LearnerClassController {
    private readonly classService;
    private readonly sessionService;
    private readonly assignmentService;
    private readonly learnerClassService;
    private readonly assignmentSubmissionService;
    private readonly feedbackService;
    constructor(classService: IClassService, sessionService: ISessionService, assignmentService: IAssignmentService, learnerClassService: ILearnerClassService, assignmentSubmissionService: IAssignmentSubmissionService, feedbackService: IFeedbackService);
    enrollClass(req: any, classId: string, enrollClassDto: EnrollClassDto): Promise<import("@src/transaction/dto/momo-payment.dto").CreateMomoPaymentResponse>;
    myClassList(req: any, pagination: PaginationParams, queryClassDto: QueryClassDto): Promise<any>;
    getDetail(req: any, classId: string): Promise<any>;
    getLessonDetail(req: any, classId: string, sessionId: string): Promise<import("../schemas/session.schema").Session>;
    getAssignmentDetail(req: any, classId: string, assignmentId: string): Promise<{
        submission: import("../schemas/assignment-submission.schema").AssignmentSubmission;
        instructor: any;
        _id: string;
        title: string;
        description: string;
        attachments: import("../../media/dto/base-media.dto").BaseMediaDto[];
        deadline?: Date;
    }>;
    submitAssignment(req: any, classId: string, createAssignmentSubmissionDto: CreateAssignmentSubmissionDto): Promise<IDResponse>;
}
