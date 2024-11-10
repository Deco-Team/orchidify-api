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
import { SlotNumber, SlotStatus } from '@common/contracts/constant';
export type SlotDocument = HydratedDocument<Slot>;
export declare class Slot {
    constructor(id?: string);
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: SlotStatus;
    instructorId: Types.ObjectId;
    sessionId: Types.ObjectId;
    classId: Types.ObjectId;
    metadata: Record<string, any>;
    hasTakenAttendance: boolean;
}
export declare const SlotSchema: import("mongoose").Schema<Slot, import("mongoose").Model<Slot, any, any, any, import("mongoose").Document<unknown, any, Slot> & Slot & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Slot, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Slot>> & import("mongoose").FlatRecord<Slot> & Required<{
    _id: string;
}>>;
