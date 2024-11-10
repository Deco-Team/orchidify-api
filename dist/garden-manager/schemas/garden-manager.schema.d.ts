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
import { GardenManagerStatus } from '@common/contracts/constant';
export type GardenManagerDocument = HydratedDocument<GardenManager>;
export declare class GardenManager {
    constructor(id?: string);
    _id: string;
    name: string;
    email: string;
    password: string;
    idCardPhoto: string;
    status: GardenManagerStatus;
}
export declare const GardenManagerSchema: import("mongoose").Schema<GardenManager, import("mongoose").Model<GardenManager, any, any, any, import("mongoose").Document<unknown, any, GardenManager> & GardenManager & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GardenManager, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<GardenManager>> & import("mongoose").FlatRecord<GardenManager> & Required<{
    _id: string;
}>>;
