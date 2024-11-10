/// <reference types="mongoose-paginate-v2" />
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
import { ICourseRepository } from '@course/repositories/course.repository';
import { Course, CourseDocument } from '@course/schemas/course.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreateCourseComboDto } from '@course/dto/create-course-combo.dto';
import { QueryCourseComboDto, StaffQueryCourseComboDto } from '@course/dto/view-course-combo.dto';
export declare const ICourseComboService: unique symbol;
export interface ICourseComboService {
    create(createCourseComboDto: CreateCourseComboDto, options?: SaveOptions | undefined): Promise<CourseDocument>;
    findById(courseId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<CourseDocument>;
    update(conditions: FilterQuery<Course>, payload: UpdateQuery<Course>, options?: QueryOptions | undefined): Promise<CourseDocument>;
    listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseComboDto): any;
    listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseComboDto): any;
    findMany(conditions: FilterQuery<CourseDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<CourseDocument[]>;
}
export declare class CourseComboService implements ICourseComboService {
    private readonly courseRepository;
    constructor(courseRepository: ICourseRepository);
    create(createCourseComboDto: CreateCourseComboDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>;
    findById(courseId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Course>, payload: UpdateQuery<Course>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>, never>>;
    listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseComboDto, projection?: readonly ["_id", "code", "title", "status", "childCourseIds", "discount", "instructorId", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>>;
    listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseComboDto, projection?: readonly ["_id", "code", "title", "status", "childCourseIds", "discount", "instructorId", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>>;
    findMany(conditions: FilterQuery<CourseDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>)[]>;
    private generateCode;
}
