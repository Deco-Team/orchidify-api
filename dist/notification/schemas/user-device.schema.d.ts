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
import { HydratedDocument, Types } from 'mongoose';
import { UserDeviceStatus, UserRole } from '@common/contracts/constant';
export type UserDeviceDocument = HydratedDocument<UserDevice>;
export declare class UserDevice {
    constructor(id?: string);
    _id: string;
    userId: Types.ObjectId;
    userRole: UserRole;
    fcmToken: string;
    browser: string;
    os: string;
    status: UserDeviceStatus;
}
export declare const UserDeviceSchema: import("mongoose").Schema<UserDevice, import("mongoose").Model<UserDevice, any, any, any, import("mongoose").Document<unknown, any, UserDevice> & UserDevice & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserDevice, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserDevice>> & import("mongoose").FlatRecord<UserDevice> & Required<{
    _id: string;
}>>;
