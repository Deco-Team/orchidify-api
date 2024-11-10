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
import { ClassStatus, SlotNumber } from '@common/contracts/constant';
import { IClassService } from '@class/services/class.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassDto } from '@class/dto/view-class.dto';
import { IAssignmentService } from '@class/services/assignment.service';
import { ISessionService } from '@class/services/session.service';
import { Types } from 'mongoose';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { CancelClassDto } from '@class/dto/cancel-class.dto';
export declare class ManagementClassController {
    private readonly classService;
    private readonly sessionService;
    private readonly assignmentService;
    private readonly learnerClassService;
    constructor(classService: IClassService, sessionService: ISessionService, assignmentService: IAssignmentService, learnerClassService: ILearnerClassService);
    list(pagination: PaginationParams, queryClassDto: QueryClassDto): Promise<any>;
    getDetail(classId: string): Promise<{
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
        slotNumbers: SlotNumber[];
        rate: number;
        cancelReason: string;
        gardenRequiredToolkits: string;
        instructorId: Types.ObjectId;
        gardenId: Types.ObjectId;
        courseId: Types.ObjectId;
        progress: import("mongoose").FlattenMaps<import("../schemas/class.schema").Progress>;
        ratingSummary: import("mongoose").FlattenMaps<import("../dto/rating-summary.dto").BaseRatingSummaryDto>;
    }>;
    getLessonDetail(classId: string, sessionId: string): Promise<import("../schemas/session.schema").Session>;
    getAssignmentDetail(classId: string, assignmentId: string): Promise<import("../schemas/assignment.schema").Assignment>;
    getClassToolkitRequirements(classId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/class.schema").Class> & import("../schemas/class.schema").Class & Required<{
        _id: string;
    }>>;
    completeClass(req: any, classId: string): Promise<SuccessResponse>;
    cancelClass(req: any, classId: string, cancelClassDto: CancelClassDto): Promise<SuccessResponse>;
}
