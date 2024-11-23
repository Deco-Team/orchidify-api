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
import { CreateCourseDto } from '@course/dto/create-course.dto';
import { CourseStatus } from '@common/contracts/constant';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryCourseDto, PublicQueryCourseDto, StaffQueryCourseDto } from '@course/dto/view-course.dto';
import { HelperService } from '@common/services/helper.service';
import { UserAuth } from '@common/contracts/dto';
import { ILearnerClassService } from '@class/services/learner-class.service';
export declare const ICourseService: unique symbol;
export interface ICourseService {
    create(createCourseDto: CreateCourseDto, options?: SaveOptions | undefined): Promise<CourseDocument>;
    findById(courseId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<CourseDocument>;
    update(conditions: FilterQuery<Course>, payload: UpdateQuery<Course>, options?: QueryOptions | undefined): Promise<CourseDocument>;
    listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseDto): any;
    listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseDto): any;
    listPublicCourses(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto): any;
    listByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): any;
    listBestSellerCoursesByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): any;
    listRecommendedCoursesByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): any;
    findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]>;
    findMany(conditions: FilterQuery<CourseDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<CourseDocument[]>;
}
export declare class CourseService implements ICourseService {
    private readonly helperService;
    private readonly courseRepository;
    private readonly learnerClassService;
    constructor(helperService: HelperService, courseRepository: ICourseRepository, learnerClassService: ILearnerClassService);
    create(createCourseDto: CreateCourseDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
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
    listByInstructor(instructorId: string, pagination: PaginationParams, queryCourseDto: QueryCourseDto, projection?: readonly ["_id", "code", "title", "price", "level", "type", "duration", "thumbnail", "status", "learnerLimit", "rate", "ratingSummary", "discount", "instructorId", "isRequesting", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>>;
    listByStaff(pagination: PaginationParams, queryCourseDto: StaffQueryCourseDto, projection?: readonly ["_id", "code", "title", "price", "level", "type", "duration", "thumbnail", "status", "learnerLimit", "rate", "ratingSummary", "discount", "instructorId", "isRequesting", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>>>;
    listPublicCourses(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto): Promise<{
        docs: any[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        pagingCounter: any;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number;
        nextPage: number;
    }>;
    listByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): Promise<{
        docs: any[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        pagingCounter: any;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number;
        nextPage: number;
    }>;
    listBestSellerCoursesByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): Promise<{
        docs: any[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        pagingCounter: any;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number;
        nextPage: number;
    }>;
    listRecommendedCoursesByLearner(pagination: PaginationParams, queryCourseDto: PublicQueryCourseDto, userAuth: UserAuth): Promise<{
        docs: any[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        pagingCounter: any;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number;
        nextPage: number;
    }>;
    findManyByStatus(status: CourseStatus[]): Promise<CourseDocument[]>;
    findMany(conditions: FilterQuery<CourseDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: string;
    }>)[]>;
    private generateCode;
}
