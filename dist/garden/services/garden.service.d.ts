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
import { IGardenRepository } from '@garden/repositories/garden.repository';
import { Garden, GardenDocument } from '@garden/schemas/garden.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreateGardenDto } from '@garden/dto/create-garden.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryGardenDto } from '@garden/dto/view-garden.dto';
import { AvailableGardenListItemResponse, QueryAvailableGardenDto } from '@garden/dto/view-available-garden.dto';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
export declare const IGardenService: unique symbol;
export interface IGardenService {
    create(createGardenDto: CreateGardenDto, options?: SaveOptions | undefined): Promise<GardenDocument>;
    findById(gardenId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenDocument>;
    findOneBy(conditions: FilterQuery<Garden>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenDocument>;
    update(conditions: FilterQuery<Garden>, payload: UpdateQuery<Garden>, options?: QueryOptions | undefined): Promise<GardenDocument>;
    findManyByGardenManagerId(gardenManagerId: string): Promise<GardenDocument[]>;
    list(pagination: PaginationParams, queryGardenDto: QueryGardenDto, projection?: string | Record<string, any>, populate?: Array<PopulateOptions>): any;
    getAvailableGardenList(queryAvailableGardenDto: QueryAvailableGardenDto): Promise<AvailableGardenListItemResponse[]>;
}
export declare class GardenService implements IGardenService {
    private readonly gardenRepository;
    private readonly gardenTimesheetService;
    private readonly appLogger;
    constructor(gardenRepository: IGardenRepository, gardenTimesheetService: IGardenTimesheetService);
    create(createGardenDto: CreateGardenDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>>;
    findById(gardenId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<Garden>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Garden>, payload: UpdateQuery<Garden>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>, never>>;
    findManyByGardenManagerId(gardenManagerId: string): Promise<GardenDocument[]>;
    list(pagination: PaginationParams, queryCourseDto: QueryGardenDto, projection?: readonly ["_id", "name", "description", "address", "addressLink", "gardenManagerId", "status", "maxClass", "createdAt", "updatedAt"], populate?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
        _id: string;
    }>>>;
    getAvailableGardenList(queryAvailableGardenDto: QueryAvailableGardenDto): Promise<AvailableGardenListItemResponse[]>;
}
