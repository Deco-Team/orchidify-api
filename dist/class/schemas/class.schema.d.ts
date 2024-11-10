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
import { ClassStatus, SlotNumber, UserRole, Weekday } from '@common/contracts/constant';
import { BaseMediaDto } from '@media/dto/base-media.dto';
import { Session } from './session.schema';
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto';
export type ClassDocument = HydratedDocument<Class>;
export declare class ClassStatusHistory {
    status: ClassStatus;
    timestamp: Date;
    userId: Types.ObjectId;
    userRole: UserRole;
}
export declare class Progress {
    total: number;
    completed: number;
    percentage: number;
}
export declare class Class {
    constructor(id?: string);
    _id: string;
    code: string;
    title: string;
    description: string;
    startDate: Date;
    price: number;
    level: string;
    type: string[];
    duration: number;
    thumbnail: string;
    media: BaseMediaDto[];
    sessions: Session[];
    status: ClassStatus;
    histories: ClassStatusHistory[];
    learnerLimit: number;
    learnerQuantity: number;
    weekdays: Weekday[];
    slotNumbers: SlotNumber[];
    rate: number;
    cancelReason: string;
    gardenRequiredToolkits: string;
    instructorId: Types.ObjectId;
    gardenId: Types.ObjectId;
    courseId: Types.ObjectId;
    progress: Progress;
    ratingSummary: BaseRatingSummaryDto;
}
export declare const ClassSchema: import("mongoose").Schema<Class, import("mongoose").Model<Class, any, any, any, import("mongoose").Document<unknown, any, Class> & Class & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Class, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Class>> & import("mongoose").FlatRecord<Class> & Required<{
    _id: string;
}>>;
