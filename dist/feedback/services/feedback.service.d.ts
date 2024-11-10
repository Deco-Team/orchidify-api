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
import { IFeedbackRepository } from '@feedback/repositories/feedback.repository';
import { Feedback, FeedbackDocument } from '@feedback/schemas/feedback.schema';
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { QueryFeedbackDto } from '@feedback/dto/view-feedback.dto';
import { SendFeedbackDto } from '@feedback/dto/send-feedback.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto';
import { SuccessResponse } from '@common/contracts/dto';
import { IClassService } from '@class/services/class.service';
import { ICourseService } from '@course/services/course.service';
export declare const IFeedbackService: unique symbol;
export interface IFeedbackService {
    sendFeedback(sendFeedbackDto: SendFeedbackDto, classRatingSummary: BaseRatingSummaryDto, courseRatingSummary: BaseRatingSummaryDto): Promise<SuccessResponse>;
    create(sendFeedbackDto: SendFeedbackDto, options?: SaveOptions | undefined): Promise<FeedbackDocument>;
    findById(feedbackId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<FeedbackDocument>;
    findOneBy(conditions: FilterQuery<Feedback>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<FeedbackDocument>;
    findMany(conditions: FilterQuery<FeedbackDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<FeedbackDocument[]>;
    update(conditions: FilterQuery<Feedback>, payload: UpdateQuery<Feedback>, options?: QueryOptions | undefined): Promise<FeedbackDocument>;
    list(pagination: PaginationParams, queryFeedbackDto: QueryFeedbackDto, projection?: string | Record<string, any>, populate?: Array<PopulateOptions>): any;
}
export declare class FeedbackService implements IFeedbackService {
    readonly connection: Connection;
    private readonly feedbackRepository;
    private readonly classService;
    private readonly courseService;
    private readonly appLogger;
    constructor(connection: Connection, feedbackRepository: IFeedbackRepository, classService: IClassService, courseService: ICourseService);
    sendFeedback(sendFeedbackDto: SendFeedbackDto, classRatingSummaryDto: BaseRatingSummaryDto, courseRatingSummaryDto: BaseRatingSummaryDto): Promise<SuccessResponse>;
    create(sendFeedbackDto: SendFeedbackDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Feedback>, payload: UpdateQuery<Feedback>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>, never>>;
    findById(feedbackId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<Feedback>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>>;
    findMany(conditions: FilterQuery<FeedbackDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>)[]>;
    list(pagination: PaginationParams, queryFeedbackDto: QueryFeedbackDto, projection?: readonly ["_id", "rate", "comment", "learnerId", "classId", "createdAt", "updatedAt"], populate?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Feedback> & Feedback & Required<{
        _id: string;
    }>>>;
}
