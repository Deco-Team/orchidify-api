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
import { ISettingRepository } from '@setting/repositories/setting.repository';
import { Setting, SettingDocument } from '@setting/schemas/setting.schema';
import { FilterQuery, PopulateOptions, QueryOptions, UpdateQuery } from 'mongoose';
import { SettingKey } from '@setting/contracts/constant';
export declare const ISettingService: unique symbol;
export interface ISettingService {
    findById(settingId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<SettingDocument>;
    findByKey(key: SettingKey, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<SettingDocument>;
    update(conditions: FilterQuery<Setting>, payload: UpdateQuery<Setting>, options?: QueryOptions | undefined): Promise<SettingDocument>;
}
export declare class SettingService implements ISettingService {
    private readonly settingRepository;
    constructor(settingRepository: ISettingRepository);
    findById(settingId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Setting> & Setting & Required<{
        _id: string;
    }>>;
    findByKey(key: SettingKey, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Setting> & Setting & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Setting>, payload: UpdateQuery<Setting>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Setting> & Setting & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Setting> & Setting & Required<{
        _id: string;
    }>, never>>;
}
