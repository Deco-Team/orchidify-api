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
import { IUserDeviceRepository } from '@notification/repositories/user-device.repository';
import { UserDevice, UserDeviceDocument } from '@notification/schemas/user-device.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreateUserDeviceDto } from '@notification/dto/user-device.dto';
export declare const IUserDeviceService: unique symbol;
export interface IUserDeviceService {
    create(createUserDeviceDto: CreateUserDeviceDto, options?: SaveOptions | undefined): Promise<UserDeviceDocument>;
    findById(userDeviceId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<UserDeviceDocument>;
    findByFcmToken(fcmToken: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<UserDeviceDocument>;
    findOneBy(conditions: FilterQuery<UserDevice>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<UserDeviceDocument>;
    findMany(conditions: FilterQuery<UserDeviceDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<UserDeviceDocument[]>;
    update(conditions: FilterQuery<UserDevice>, payload: UpdateQuery<UserDevice>, options?: QueryOptions | undefined): Promise<UserDeviceDocument>;
}
export declare class UserDeviceService implements IUserDeviceService {
    private readonly userDeviceRepository;
    private readonly appLogger;
    constructor(userDeviceRepository: IUserDeviceRepository);
    create(createUserDeviceDto: CreateUserDeviceDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<UserDevice>, payload: UpdateQuery<UserDevice>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>, never>>;
    findById(userDeviceId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>>;
    findByFcmToken(fcmToken: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<UserDevice>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>>;
    findMany(conditions: FilterQuery<UserDeviceDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, UserDevice> & UserDevice & Required<{
        _id: string;
    }>)[]>;
}
