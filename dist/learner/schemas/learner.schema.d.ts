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
import { LearnerStatus } from '@common/contracts/constant';
export type LearnerDocument = HydratedDocument<Learner>;
export declare class Learner {
    constructor(id?: string);
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    dateOfBirth: Date;
    phone: string;
    status: LearnerStatus;
}
export declare const LearnerSchema: import("mongoose").Schema<Learner, import("mongoose").Model<Learner, any, any, any, import("mongoose").Document<unknown, any, Learner> & Learner & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Learner, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Learner>> & import("mongoose").FlatRecord<Learner> & Required<{
    _id: string;
}>>;
