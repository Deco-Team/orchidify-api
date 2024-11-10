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
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { ICourseService } from '@course/services/course.service';
import { ICourseSessionService } from '@course/services/course-session.service';
import { ICourseAssignmentService } from '@course/services/course-assignment.service';
import { StaffQueryCourseDto } from '@course/dto/view-course.dto';
export declare class ManagementCourseController {
    private readonly courseService;
    private readonly courseSessionService;
    private readonly courseAssignmentService;
    constructor(courseService: ICourseService, courseSessionService: ICourseSessionService, courseAssignmentService: ICourseAssignmentService);
    list(pagination: PaginationParams, queryCourseDto: StaffQueryCourseDto): Promise<any>;
    getDetail(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/course.schema").Course> & import("../schemas/course.schema").Course & Required<{
        _id: string;
    }>>;
    getSessionDetail(courseId: string, sessionId: string): Promise<import("../../class/schemas/session.schema").Session>;
    getAssignmentDetail(courseId: string, assignmentId: string): Promise<import("../../class/schemas/assignment.schema").Assignment>;
}
