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
import { UserRole } from '@common/contracts/constant';
export type UserTokenDocument = HydratedDocument<UserToken>;
export declare class UserToken {
    constructor(id?: string);
    _id: string;
    userId: Types.ObjectId;
    role: UserRole;
    refreshToken: string;
    enabled: boolean;
}
export declare const UserTokenSchema: import("mongoose").Schema<UserToken, import("mongoose").Model<UserToken, any, any, any, import("mongoose").Document<unknown, any, UserToken> & UserToken & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserToken, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserToken>> & import("mongoose").FlatRecord<UserToken> & Required<{
    _id: string;
}>>;
