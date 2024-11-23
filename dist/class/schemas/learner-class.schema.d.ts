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
export type LearnerClassDocument = HydratedDocument<LearnerClass>;
export declare class LearnerClass {
    constructor(id?: string);
    _id: string;
    enrollDate: Date;
    finishDate: Date;
    transactionId: Types.ObjectId;
    learnerId: Types.ObjectId;
    classId: Types.ObjectId;
    courseId: Types.ObjectId;
    price: number;
    discount: number;
}
export declare const LearnerClassSchema: import("mongoose").Schema<LearnerClass, import("mongoose").Model<LearnerClass, any, any, any, import("mongoose").Document<unknown, any, LearnerClass> & LearnerClass & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LearnerClass, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<LearnerClass>> & import("mongoose").FlatRecord<LearnerClass> & Required<{
    _id: string;
}>>;
