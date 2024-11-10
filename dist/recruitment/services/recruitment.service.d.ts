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
import { NotificationAdapter } from '@common/adapters/notification.adapter';
import { RecruitmentStatus } from '@common/contracts/constant';
import { SuccessResponse, UserAuth } from '@common/contracts/dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { HelperService } from '@common/services/helper.service';
import { IQueueProducerService } from '@queue/services/queue-producer.service';
import { ProcessRecruitmentApplicationDto } from '@recruitment/dto/process-recruitment-application.dto';
import { RejectRecruitmentProcessDto } from '@recruitment/dto/reject-recruitment-process.dto';
import { QueryRecruitmentDto } from '@recruitment/dto/view-recruitment.dto';
import { IRecruitmentRepository } from '@recruitment/repositories/recruitment.repository';
import { Recruitment, RecruitmentDocument } from '@recruitment/schemas/recruitment.schema';
import { ISettingService } from '@setting/services/setting.service';
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
export declare const IRecruitmentService: unique symbol;
export interface IRecruitmentService {
    create(createRecruitmentDto: any, options?: SaveOptions | undefined): Promise<RecruitmentDocument>;
    findById(recruitmentId: string, projection?: string | Record<string, any>): Promise<RecruitmentDocument>;
    findOneByApplicationEmailAndStatus(applicationEmail: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument>;
    findByHandledByAndStatus(handledBy: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]>;
    update(conditions: FilterQuery<Recruitment>, payload: UpdateQuery<Recruitment>, options?: QueryOptions | undefined): Promise<RecruitmentDocument>;
    list(pagination: PaginationParams, queryRecruitmentDto: QueryRecruitmentDto): any;
    processRecruitmentApplication(recruitmentId: string, processRecruitmentApplicationDto: ProcessRecruitmentApplicationDto, userAuth: UserAuth): Promise<SuccessResponse>;
    processRecruitmentInterview(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectRecruitmentProcess(recruitmentId: string, rejectRecruitmentProcessDto: RejectRecruitmentProcessDto, userAuth: UserAuth): Promise<SuccessResponse>;
    expiredRecruitmentProcess(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse>;
}
export declare class RecruitmentService implements IRecruitmentService {
    private readonly notificationAdapter;
    private readonly helperService;
    private readonly recruitmentRepository;
    private readonly settingService;
    private readonly queueProducerService;
    private readonly appLogger;
    constructor(notificationAdapter: NotificationAdapter, helperService: HelperService, recruitmentRepository: IRecruitmentRepository, settingService: ISettingService, queueProducerService: IQueueProducerService);
    create(createRecruitmentDto: any, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>>;
    findById(recruitmentId: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>>;
    findOneByApplicationEmailAndStatus(applicationEmail: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument>;
    findByHandledByAndStatus(handledBy: string, status: RecruitmentStatus[]): Promise<RecruitmentDocument[]>;
    update(conditions: FilterQuery<Recruitment>, payload: UpdateQuery<Recruitment>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryLearnerDto: QueryRecruitmentDto, projection?: readonly ["_id", "applicationInfo", "meetingUrl", "status", "rejectReason", "handledBy", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Recruitment> & Recruitment & Required<{
        _id: string;
    }>>>;
    processRecruitmentApplication(recruitmentId: string, processRecruitmentApplicationDto: ProcessRecruitmentApplicationDto, userAuth: UserAuth): Promise<SuccessResponse>;
    processRecruitmentInterview(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    rejectRecruitmentProcess(recruitmentId: string, rejectRecruitmentProcessDto: RejectRecruitmentProcessDto, userAuth: UserAuth): Promise<SuccessResponse>;
    expiredRecruitmentProcess(recruitmentId: string, userAuth: UserAuth): Promise<SuccessResponse>;
    private getExpiredAt;
    private addAutoExpiredJobWhenCreateRecruitmentApplication;
    private updateAutoExpiredJobWhenCreateRecruitmentApplication;
}
