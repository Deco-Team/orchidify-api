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
import { BaseMediaDto } from '@media/dto/base-media.dto';
export type AssignmentDocument = HydratedDocument<Assignment>;
export declare class Assignment {
    constructor(id?: string);
    _id: string;
    title: string;
    description: string;
    attachments: BaseMediaDto[];
}
export declare const AssignmentSchema: import("mongoose").Schema<Assignment, import("mongoose").Model<Assignment, any, any, any, import("mongoose").Document<unknown, any, Assignment> & Assignment & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Assignment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Assignment>> & import("mongoose").FlatRecord<Assignment> & Required<{
    _id: string;
}>>;
