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
import { GardenStatus } from '@common/contracts/constant';
import { GardenManager } from '@garden-manager/schemas/garden-manager.schema';
export type GardenDocument = HydratedDocument<Garden>;
export declare class Garden {
    constructor(id?: string);
    _id: string;
    name: string;
    description: string;
    address: string;
    addressLink: string;
    images: string[];
    status: GardenStatus;
    maxClass: number;
    gardenManagerId: Types.ObjectId | GardenManager;
}
export declare const GardenSchema: import("mongoose").Schema<Garden, import("mongoose").Model<Garden, any, any, any, import("mongoose").Document<unknown, any, Garden> & Garden & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Garden, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Garden>> & import("mongoose").FlatRecord<Garden> & Required<{
    _id: string;
}>>;
