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
import { HelperService } from '@common/services/helper.service';
import { INotificationService } from '@notification/services/notification.service';
import { IReportService } from '@report/services/report.service';
import { CreateStaffDto } from '@staff/dto/create-staff.dto';
import { QueryStaffDto } from '@staff/dto/view-staff.dto';
import { IStaffRepository } from '@staff/repositories/staff.repository';
import { Staff, StaffDocument } from '@staff/schemas/staff.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
export declare const IStaffService: unique symbol;
export interface IStaffService extends IAuthUserService {
    create(createStaffDto: CreateStaffDto, options?: SaveOptions | undefined): Promise<StaffDocument>;
    findById(staffId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<StaffDocument>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<StaffDocument>;
    update(conditions: FilterQuery<Staff>, payload: UpdateQuery<Staff>, options?: QueryOptions | undefined): Promise<StaffDocument>;
    list(pagination: PaginationParams, queryStaffDto: QueryStaffDto): any;
    findMany(conditions: FilterQuery<StaffDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<StaffDocument[]>;
}
export declare class StaffService implements IStaffService {
    private readonly helperService;
    private readonly staffRepository;
    private readonly notificationService;
    private readonly reportService;
    constructor(helperService: HelperService, staffRepository: IStaffRepository, notificationService: INotificationService, reportService: IReportService);
    create(createStaffDto: CreateStaffDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>>;
    findById(staffId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Staff>, payload: UpdateQuery<StaffDocument>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, QueryStaffDto: QueryStaffDto, projection?: readonly ["_id", "name", "email", "staffCode", "idCardPhoto", "status", "role", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>>>;
    findMany(conditions: FilterQuery<StaffDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Staff> & Staff & Required<{
        _id: string;
    }>)[]>;
    private generateStaffCode;
}
