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
import { ClassRequestStatus, ClassRequestType, UserRole } from '@common/contracts/constant';
export type ClassRequestDocument = HydratedDocument<ClassRequest>;
export declare class ClassRequestStatusHistory {
    status: ClassRequestStatus;
    timestamp: Date;
    userId: Types.ObjectId;
    userRole: UserRole;
}
export declare class ClassRequest {
    constructor(id?: string);
    _id: string;
    type: ClassRequestType;
    status: ClassRequestStatus;
    rejectReason: string;
    histories: ClassRequestStatusHistory[];
    description: string;
    metadata: Record<string, any>;
    createdBy: Types.ObjectId;
    courseId: Types.ObjectId;
    classId: Types.ObjectId;
}
export declare const ClassRequestSchema: import("mongoose").Schema<ClassRequest, import("mongoose").Model<ClassRequest, any, any, any, import("mongoose").Document<unknown, any, ClassRequest> & ClassRequest & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClassRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ClassRequest>> & import("mongoose").FlatRecord<ClassRequest> & Required<{
    _id: string;
}>>;
