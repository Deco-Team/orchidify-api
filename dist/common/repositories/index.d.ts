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
import { Document, QueryOptions, SaveOptions, FilterQuery, UpdateQuery, PaginateModel, PaginateOptions, IfAny, Require_id, UpdateWriteOpResult, MongooseQueryOptions } from 'mongoose';
import { ErrorResponse } from '@common/exceptions/app.exception';
import { PopulateOptions } from 'mongoose';
export declare abstract class AbstractRepository<T extends Document> {
    model: PaginateModel<T>;
    constructor(model: PaginateModel<T>);
    findOne({ conditions, projection, populates, options }: {
        conditions: FilterQuery<T>;
        projection?: Record<string, any> | string;
        populates?: Array<PopulateOptions>;
        options?: QueryOptions;
    }): Promise<T | undefined>;
    firstOrFail({ conditions, projection, options, populates, error }: {
        conditions: FilterQuery<T>;
        projection?: Record<string, any> | string;
        populates?: Array<PopulateOptions>;
        options?: QueryOptions;
        error?: ErrorResponse;
    }): Promise<T>;
    findMany({ conditions, projection, populates, sort, options }: {
        conditions: FilterQuery<T>;
        projection?: Record<string, any>;
        populates?: Array<PopulateOptions>;
        sort?: Record<string, any>;
        options?: QueryOptions;
    }): Promise<Array<T>>;
    paginate(conditions: FilterQuery<T>, options?: PaginateOptions): Promise<import('mongoose').PaginateResult<import('mongoose').IfAny<T, any, Document<unknown, PaginateOptions, T> & Omit<import('mongoose').Require_id<T>, never>>>>;
    create(payload: Record<string, any>, options?: SaveOptions | undefined): Promise<T>;
    updateOneOrFail(conditions: FilterQuery<T>, payload: object, options?: SaveOptions): Promise<T>;
    findOneAndUpdate(conditions: FilterQuery<T>, payload: UpdateQuery<T>, options?: QueryOptions): Promise<import('mongoose').IfAny<T, any, Document<unknown, {}, T> & Omit<import('mongoose').Require_id<T>, never>>>;
    updateMany(conditions: FilterQuery<T>, payload: UpdateQuery<T>, options?: (import('mongodb').UpdateOptions & Omit<MongooseQueryOptions<T>, 'lean'>) | null): Promise<UpdateWriteOpResult>;
    findOneAndDelete(conditions: FilterQuery<T>, options?: QueryOptions): Promise<IfAny<T, any, Document<unknown, {}, T> & Omit<Require_id<T>, never>>>;
    deleteMany(conditions: FilterQuery<T>, options?: (import('mongodb').DeleteOptions & Omit<MongooseQueryOptions<T>, 'lean' | 'timestamps'>) | null): Promise<import('mongodb').DeleteResult>;
}
