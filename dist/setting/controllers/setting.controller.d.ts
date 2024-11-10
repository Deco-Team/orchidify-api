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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { ISettingService } from '@setting/services/setting.service';
import { QuerySettingDto } from '@setting/dto/view-setting.dto';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: ISettingService);
    getByKey(querySettingDto: QuerySettingDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/setting.schema").Setting> & import("../schemas/setting.schema").Setting & Required<{
        _id: string;
    }>>;
    getCourseTypesSetting(): Promise<{
        docs: string | number | Record<string, any> | (number | String)[];
    }>;
}
