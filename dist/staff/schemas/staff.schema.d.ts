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
import { HydratedDocument } from 'mongoose';
import { StaffStatus, UserRole } from '@common/contracts/constant';
export type StaffDocument = HydratedDocument<Staff>;
export declare class Staff {
    constructor(id?: string);
    _id: string;
    name: string;
    email: string;
    staffCode: string;
    password: string;
    status: StaffStatus;
    idCardPhoto: string;
    role: UserRole.ADMIN | UserRole.STAFF;
}
export declare const StaffSchema: import("mongoose").Schema<Staff, import("mongoose").Model<Staff, any, any, any, import("mongoose").Document<unknown, any, Staff> & Staff & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Staff, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Staff>> & import("mongoose").FlatRecord<Staff> & Required<{
    _id: string;
}>>;
