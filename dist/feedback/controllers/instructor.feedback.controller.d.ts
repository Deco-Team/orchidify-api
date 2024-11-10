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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { IFeedbackService } from '@feedback/services/feedback.service';
import { QueryFeedbackDto } from '@feedback/dto/view-feedback.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { ICourseService } from '@course/services/course.service';
import { IClassService } from '@class/services/class.service';
export declare class InstructorFeedbackController {
    private readonly feedbackService;
    private readonly courseService;
    private readonly classService;
    constructor(feedbackService: IFeedbackService, courseService: ICourseService, classService: IClassService);
    listCourseFeedback(req: any, courseId: string, pagination: PaginationParams, queryFeedbackDto: QueryFeedbackDto): Promise<any>;
    listClassFeedback(req: any, classId: string, queryFeedbackDto: QueryFeedbackDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/feedback.schema").Feedback> & import("../schemas/feedback.schema").Feedback & Required<{
            _id: string;
        }>)[];
    }>;
}
