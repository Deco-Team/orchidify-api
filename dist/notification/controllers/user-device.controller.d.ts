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
import { SuccessResponse } from '@common/contracts/dto';
import { IUserDeviceService } from '@notification/services/user-device.service';
import { CreateUserDeviceDto } from '@notification/dto/user-device.dto';
export declare class UserDeviceController {
    private readonly userDeviceService;
    constructor(userDeviceService: IUserDeviceService);
    get(req: any, fcmToken: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user-device.schema").UserDevice> & import("../schemas/user-device.schema").UserDevice & Required<{
        _id: string;
    }>>;
    create(req: any, createUserDeviceDto: CreateUserDeviceDto): Promise<SuccessResponse>;
}
