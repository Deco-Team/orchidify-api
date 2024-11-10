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
import { IClassRequestRepository } from '@src/class-request/repositories/class-request.repository';
import { ClassRequest, ClassRequestDocument } from '@src/class-request/schemas/class-request.schema';
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreatePublishClassRequestDto } from '@class-request/dto/create-publish-class-request.dto';
import { ClassRequestStatus } from '@common/contracts/constant';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassRequestDto } from '@src/class-request/dto/view-class-request.dto';
import { SuccessResponse, UserAuth } from '@common/contracts/dto';
import { ApprovePublishClassRequestDto } from '@class-request/dto/approve-publish-class-request.dto';
import { RejectPublishClassRequestDto } from '@class-request/dto/reject-publish-class-request.dto';
import { ICourseService } from '@course/services/course.service';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { IClassService } from '@class/services/class.service';
import { IQueueProducerService } from '@queue/services/queue-producer.service';
import { ISettingService } from '@setting/services/setting.service';
import { HelperService } from '@common/services/helper.service';
export declare const IClassRequestService: unique symbol;
export interface IClassRequestService {
    createPublishClassRequest(createPublishClassRequestDto: CreatePublishClassRequestDto, options?: SaveOptions | undefined): Promise<ClassRequestDocument>;
    findById(classRequestId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<ClassRequestDocument>;
    update(conditions: FilterQuery<ClassRequest>, payload: UpdateQuery<ClassRequest>, options?: QueryOptions | undefined): Promise<ClassRequestDocument>;
    list(pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto, projection?: Record<string, any>, populates?: Array<PopulateOptions>): any;
    findMany(conditions: FilterQuery<ClassRequestDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<ClassRequestDocument[]>;
    findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]>;
    findManyByCreatedByAndStatus(createdBy: string, status?: ClassRequestStatus[]): Promise<ClassRequestDocument[]>;
    countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>;
    cancelPublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    expirePublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    approvePublishClassRequest(classRequestId: string, approvePublishClassRequestDto: ApprovePublishClassRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectPublishClassRequest(classRequestId: string, rejectPublishClassRequestDto: RejectPublishClassRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
}
export declare class ClassRequestService implements IClassRequestService {
    private readonly classRequestRepository;
    private readonly courseService;
    private readonly gardenTimesheetService;
    private readonly classService;
    readonly connection: Connection;
    private readonly queueProducerService;
    private readonly settingService;
    private readonly helperService;
    private readonly appLogger;
    constructor(classRequestRepository: IClassRequestRepository, courseService: ICourseService, gardenTimesheetService: IGardenTimesheetService, classService: IClassService, connection: Connection, queueProducerService: IQueueProducerService, settingService: ISettingService, helperService: HelperService);
    createPublishClassRequest(createPublishClassRequestDto: CreatePublishClassRequestDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>>;
    findById(classRequestId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<ClassRequest>, payload: UpdateQuery<ClassRequest>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto, projection?: readonly ["_id", "type", "status", "rejectReason", "description", "metadata", "createdBy", "courseId", "classId", "createdAt", "updatedAt"], populates?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>>>;
    findMany(conditions: FilterQuery<ClassRequestDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, ClassRequest> & ClassRequest & Required<{
        _id: string;
    }>)[]>;
    findManyByStatus(status: ClassRequestStatus[]): Promise<ClassRequestDocument[]>;
    findManyByCreatedByAndStatus(createdBy: string, status?: ClassRequestStatus[]): Promise<ClassRequestDocument[]>;
    countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>;
    cancelPublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    approvePublishClassRequest(classRequestId: string, approvePublishClassRequestDto: ApprovePublishClassRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectPublishClassRequest(classRequestId: string, rejectPublishClassRequestDto: RejectPublishClassRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
    expirePublishClassRequest(classRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    getExpiredAt(date: Date): Promise<Date>;
    addClassRequestAutoExpiredJob(classRequest: ClassRequest): Promise<void>;
}
