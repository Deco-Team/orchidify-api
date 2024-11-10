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
import { IGardenManagerRepository } from '@garden-manager/repositories/garden-manager.repository';
import { GardenManager, GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { IAuthUserService } from '@auth/services/auth.service';
import { CreateGardenManagerDto } from '@garden-manager/dto/create-garden-manager.dto';
import { QueryGardenManagerDto } from '@garden-manager/dto/view-garden-manager.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { HelperService } from '@common/services/helper.service';
import { NotificationAdapter } from '@common/adapters/notification.adapter';
export declare const IGardenManagerService: unique symbol;
export interface IGardenManagerService extends IAuthUserService {
    create(gardenManager: CreateGardenManagerDto, options?: SaveOptions | undefined): Promise<GardenManagerDocument>;
    findById(gardenManagerId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenManagerDocument>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<GardenManagerDocument>;
    update(conditions: FilterQuery<GardenManager>, payload: UpdateQuery<GardenManager>, options?: QueryOptions | undefined): Promise<GardenManagerDocument>;
    list(pagination: PaginationParams, queryGardenManagerDto: QueryGardenManagerDto): any;
}
export declare class GardenManagerService implements IGardenManagerService {
    private readonly gardenManagerRepository;
    private readonly helperService;
    private readonly notificationAdapter;
    constructor(gardenManagerRepository: IGardenManagerRepository, helperService: HelperService, notificationAdapter: NotificationAdapter);
    create(createGardenManagerDto: CreateGardenManagerDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>>;
    findById(gardenManagerId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<GardenManager>, payload: UpdateQuery<GardenManager>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryGardenManagerDto: QueryGardenManagerDto, projection?: readonly ["_id", "name", "email", "idCardPhoto", "status", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, GardenManager> & GardenManager & Required<{
        _id: string;
    }>>>;
}
