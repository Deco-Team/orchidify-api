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
import { IAuthUserService } from '@auth/services/auth.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryLearnerDto } from '@learner/dto/view-learner.dto';
import { ILearnerRepository } from '@src/learner/repositories/learner.repository';
import { Learner, LearnerDocument } from '@src/learner/schemas/learner.schema';
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
export declare const ILearnerService: unique symbol;
export interface ILearnerService extends IAuthUserService {
    create(learner: any, options?: SaveOptions | undefined): Promise<LearnerDocument>;
    findById(learnerId: string, projection?: string | Record<string, any>): Promise<LearnerDocument>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<LearnerDocument>;
    update(conditions: FilterQuery<Learner>, payload: UpdateQuery<Learner>, options?: QueryOptions | undefined): Promise<LearnerDocument>;
    list(pagination: PaginationParams, queryLearnerDto: QueryLearnerDto): any;
}
export declare class LearnerService implements ILearnerService {
    private readonly learnerRepository;
    constructor(learnerRepository: ILearnerRepository);
    create(learner: any, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>>;
    findById(learnerId: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Learner>, payload: UpdateQuery<Learner>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryLearnerDto: QueryLearnerDto, projection?: readonly ["_id", "name", "email", "avatar", "dateOfBirth", "phone", "status", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Learner> & Learner & Required<{
        _id: string;
    }>>>;
}
