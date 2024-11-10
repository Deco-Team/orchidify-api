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
import { RecruitmentStatus, UserRole } from '@common/contracts/constant';
import { Staff } from '@staff/schemas/staff.schema';
declare class ApplicationInfo {
    name: string;
    email: string;
    phone: string;
    cv: string;
    note: string;
}
declare class RecruitmentStatusHistory {
    status: RecruitmentStatus;
    timestamp: Date;
    userId: Types.ObjectId;
    userRole: UserRole;
}
export type RecruitmentDocument = HydratedDocument<Recruitment>;
export declare class Recruitment {
    constructor(id?: string);
    _id: string;
    applicationInfo: ApplicationInfo;
    meetingUrl: string;
    status: RecruitmentStatus;
    histories: RecruitmentStatusHistory[];
    rejectReason: string;
    isInstructorAdded: boolean;
    handledBy: Types.ObjectId | Staff;
}
export declare const RecruitmentSchema: import("mongoose").Schema<Recruitment, import("mongoose").Model<Recruitment, any, any, any, import("mongoose").Document<unknown, any, Recruitment> & Recruitment & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Recruitment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Recruitment>> & import("mongoose").FlatRecord<Recruitment> & Required<{
    _id: string;
}>>;
export {};
