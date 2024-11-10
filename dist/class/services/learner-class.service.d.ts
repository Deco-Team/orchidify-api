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
import { ILearnerClassRepository } from '@src/class/repositories/learner-class.repository';
import { LearnerClass, LearnerClassDocument } from '@src/class/schemas/learner-class.schema';
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassDto } from '@class/dto/view-class.dto';
import { HelperService } from '@common/services/helper.service';
import { IClassRepository } from '@class/repositories/class.repository';
export declare const ILearnerClassService: unique symbol;
export interface ILearnerClassService {
    create(createLearnerClassDto: any, options?: SaveOptions | undefined): Promise<LearnerClassDocument>;
    findById(learnerClassId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<LearnerClassDocument>;
    update(conditions: FilterQuery<LearnerClass>, payload: UpdateQuery<LearnerClass>, options?: QueryOptions | undefined): Promise<LearnerClassDocument>;
    findOneBy(conditions: FilterQuery<LearnerClass>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<LearnerClassDocument>;
    findMany(conditions: FilterQuery<LearnerClassDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<LearnerClassDocument[]>;
    listMyClassesByLearner(learnerId: string, pagination: PaginationParams, queryClassDto: QueryClassDto): any;
}
export declare class LearnerClassService implements ILearnerClassService {
    private readonly learnerClassRepository;
    private readonly classRepository;
    readonly connection: Connection;
    private readonly helperService;
    constructor(learnerClassRepository: ILearnerClassRepository, classRepository: IClassRepository, connection: Connection, helperService: HelperService);
    create(createLearnerClassDto: any, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>>;
    findById(learnerClassId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<LearnerClassDocument>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>>;
    findMany(conditions: FilterQuery<LearnerClassDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>)[]>;
    update(conditions: FilterQuery<LearnerClass>, payload: UpdateQuery<LearnerClass>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, LearnerClass> & LearnerClass & Required<{
        _id: string;
    }>, never>>;
    listMyClassesByLearner(learnerId: string, pagination: PaginationParams, queryClassDto: QueryClassDto, projection?: readonly ["_id", "code", "title", "level", "type", "thumbnail", "status", "progress", "price"]): Promise<{
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
}
