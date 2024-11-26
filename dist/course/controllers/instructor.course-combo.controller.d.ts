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
import { IDResponse, SuccessResponse } from '@common/contracts/dto';
import { ICourseService } from '@course/services/course.service';
import { CreateCourseComboDto } from '@course/dto/create-course-combo.dto';
import { UpdateCourseComboDto } from '@course/dto/update-course-combo.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { ICourseComboService } from '@course/services/course-combo.service';
import { QueryCourseComboDto } from '@course/dto/view-course-combo.dto';
import { IReportService } from '@report/services/report.service';
export declare class InstructorCourseComboController {
    private readonly courseComboService;
    private readonly courseService;
    private readonly reportService;
    constructor(courseComboService: ICourseComboService, courseService: ICourseService, reportService: IReportService);
    list(req: any, pagination: PaginationParams, queryCourseDto: QueryCourseComboDto): Promise<any>;
    getDetail(req: any, courseId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/course.schema").Course> & import("../schemas/course.schema").Course & Required<{
        _id: string;
    }>>;
    create(req: any, createCourseComboDto: CreateCourseComboDto): Promise<IDResponse>;
    update(req: any, courseId: string, updateCourseComboDto: UpdateCourseComboDto): Promise<SuccessResponse>;
    delete(req: any, courseId: string): Promise<SuccessResponse>;
}
