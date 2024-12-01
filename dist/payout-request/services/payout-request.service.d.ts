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
import { IPayoutRequestRepository } from '@src/payout-request/repositories/payout-request.repository';
import { PayoutRequest, PayoutRequestDocument } from '@src/payout-request/schemas/payout-request.schema';
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreatePayoutRequestDto } from '@payout-request/dto/create-payout-request.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryPayoutRequestDto } from '@src/payout-request/dto/view-payout-request.dto';
import { SuccessResponse, UserAuth } from '@common/contracts/dto';
import { RejectPayoutRequestDto } from '@payout-request/dto/reject-payout-request.dto';
import { IQueueProducerService } from '@queue/services/queue-producer.service';
import { ISettingService } from '@setting/services/setting.service';
import { HelperService } from '@common/services/helper.service';
import { IInstructorService } from '@instructor/services/instructor.service';
import { ITransactionService } from '@transaction/services/transaction.service';
import { INotificationService } from '@notification/services/notification.service';
import { IStaffService } from '@staff/services/staff.service';
import { IReportService } from '@report/services/report.service';
export declare const IPayoutRequestService: unique symbol;
export interface IPayoutRequestService {
    createPayoutRequest(createPayoutRequestDto: CreatePayoutRequestDto, options?: SaveOptions | undefined): Promise<PayoutRequestDocument>;
    findById(payoutRequestId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<PayoutRequestDocument>;
    update(conditions: FilterQuery<PayoutRequest>, payload: UpdateQuery<PayoutRequest>, options?: QueryOptions | undefined): Promise<PayoutRequestDocument>;
    list(pagination: PaginationParams, queryPayoutRequestDto: QueryPayoutRequestDto, projection?: Record<string, any>, populates?: Array<PopulateOptions>): any;
    findMany(conditions: FilterQuery<PayoutRequestDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<PayoutRequestDocument[]>;
    countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>;
    cancelPayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    expirePayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    approvePayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectPayoutRequest(payoutRequestId: string, rejectPayoutRequestDto: RejectPayoutRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
    getPayoutUsage({ createdBy, date }: {
        createdBy: string;
        date: Date;
    }): Promise<number>;
}
export declare class PayoutRequestService implements IPayoutRequestService {
    private readonly payoutRequestRepository;
    private readonly instructorService;
    readonly connection: Connection;
    private readonly queueProducerService;
    private readonly settingService;
    private readonly helperService;
    private readonly transactionService;
    private readonly notificationService;
    private readonly staffService;
    private readonly reportService;
    private readonly appLogger;
    constructor(payoutRequestRepository: IPayoutRequestRepository, instructorService: IInstructorService, connection: Connection, queueProducerService: IQueueProducerService, settingService: ISettingService, helperService: HelperService, transactionService: ITransactionService, notificationService: INotificationService, staffService: IStaffService, reportService: IReportService);
    createPayoutRequest(createPayoutRequestDto: CreatePayoutRequestDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>>;
    findById(payoutRequestId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<PayoutRequest>, payload: UpdateQuery<PayoutRequest>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryPayoutRequestDto: QueryPayoutRequestDto, projection?: readonly ["_id", "amount", "status", "rejectReason", "description", "createdBy", "createdAt", "updatedAt"], populates?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>>>;
    findMany(conditions: FilterQuery<PayoutRequestDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, PayoutRequest> & PayoutRequest & Required<{
        _id: string;
    }>)[]>;
    countByCreatedByAndDate(createdBy: string, date: Date): Promise<number>;
    cancelPayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    approvePayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectPayoutRequest(payoutRequestId: string, rejectPayoutRequestDto: RejectPayoutRequestDto, userAuth: UserAuth): Promise<SuccessResponse>;
    expirePayoutRequest(payoutRequestId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    getPayoutUsage({ createdBy, date }: {
        createdBy: any;
        date: any;
    }): Promise<number>;
    getExpiredAt(date: Date): Promise<Date>;
    addPayoutRequestAutoExpiredJob(payoutRequest: PayoutRequest): Promise<void>;
    private sendNotificationToStaffWhenPayoutRequestIsCreated;
}
