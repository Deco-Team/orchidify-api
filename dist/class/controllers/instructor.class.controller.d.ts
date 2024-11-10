/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { SuccessResponse } from '@common/contracts/dto';
import { ClassStatus } from '@common/contracts/constant';
import { IClassService } from '@class/services/class.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassDto } from '@class/dto/view-class.dto';
import { IAssignmentService } from '@class/services/assignment.service';
import { ISessionService } from '@class/services/session.service';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { Types } from 'mongoose';
import { IAssignmentSubmissionService } from '@class/services/assignment-submission.service';
import { GradeAssignmentSubmissionDto } from '@class/dto/assignment-submission.dto';
import { UploadSessionResourcesDto } from '@class/dto/session.dto';
export declare class InstructorClassController {
    private readonly classService;
    private readonly sessionService;
    private readonly assignmentService;
    private readonly learnerClassService;
    private readonly assignmentSubmissionService;
    constructor(classService: IClassService, sessionService: ISessionService, assignmentService: IAssignmentService, learnerClassService: ILearnerClassService, assignmentSubmissionService: IAssignmentSubmissionService);
    list(req: any, pagination: PaginationParams, queryClassDto: QueryClassDto): Promise<any>;
    getDetail(req: any, classId: string): Promise<{
        learners: any[];
        _id: string;
        code: string;
        title: string;
        description: string;
        startDate: Date;
        price: number;
        level: string;
        type: string[];
        duration: number;
        thumbnail: string;
        media: import("mongoose").FlattenMaps<import("../../media/dto/base-media.dto").BaseMediaDto>[];
        sessions: import("mongoose").FlattenMaps<import("../schemas/session.schema").Session>[];
        status: ClassStatus;
        histories: import("mongoose").FlattenMaps<import("../schemas/class.schema").ClassStatusHistory>[];
        learnerLimit: number;
        learnerQuantity: number;
        weekdays: import("@common/contracts/constant").Weekday[];
        slotNumbers: import("@common/contracts/constant").SlotNumber[];
        rate: number;
        cancelReason: string;
        gardenRequiredToolkits: string;
        instructorId: Types.ObjectId;
        gardenId: Types.ObjectId;
        courseId: Types.ObjectId;
        progress: import("mongoose").FlattenMaps<import("../schemas/class.schema").Progress>;
        ratingSummary: import("mongoose").FlattenMaps<import("../dto/rating-summary.dto").BaseRatingSummaryDto>;
    }>;
    getLessonDetail(req: any, classId: string, sessionId: string): Promise<import("../schemas/session.schema").Session>;
    getAssignmentDetail(req: any, classId: string, assignmentId: string): Promise<import("../schemas/assignment.schema").Assignment>;
    listAssignmentSubmission(req: any, classId: string, assignmentId: string): Promise<any>;
    getAssignmentSubmissionDetail(req: any, classId: string, submissionId: string): Promise<import("../schemas/assignment-submission.schema").AssignmentSubmission>;
    gradeAssignmentSubmission(req: any, classId: string, submissionId: string, gradeAssignmentSubmissionDto: GradeAssignmentSubmissionDto): Promise<SuccessResponse>;
    uploadSessionResources(req: any, classId: string, sessionId: string, uploadSessionResourcesDto: UploadSessionResourcesDto): Promise<SuccessResponse>;
}
