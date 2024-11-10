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
import { PublicQueryCourseDto } from '@course/dto/view-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: ICourseService);
    list(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto): Promise<any>;
    getDetail(req: any, courseId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/course.schema").Course> & import("../schemas/course.schema").Course & Required<{
        _id: string;
    }>>;
}
