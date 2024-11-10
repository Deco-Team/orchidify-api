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
import { GardenTimesheetStatus } from '@common/contracts/constant';
import { Slot } from './slot.schema';
export type GardenTimesheetDocument = HydratedDocument<GardenTimesheet>;
export declare class GardenTimesheet {
    constructor(id?: string);
    _id: string;
    status: GardenTimesheetStatus;
    date: Date;
    gardenId: Types.ObjectId;
    slots: Slot[];
    gardenMaxClass: number;
}
export declare const GardenTimesheetSchema: import("mongoose").Schema<GardenTimesheet, import("mongoose").Model<GardenTimesheet, any, any, any, import("mongoose").Document<unknown, any, GardenTimesheet> & GardenTimesheet & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GardenTimesheet, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<GardenTimesheet>> & import("mongoose").FlatRecord<GardenTimesheet> & Required<{
    _id: string;
}>>;
