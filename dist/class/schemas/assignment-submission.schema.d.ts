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
import { BaseMediaDto } from '@media/dto/base-media.dto';
import { SubmissionStatus } from '@common/contracts/constant';
export type AssignmentSubmissionDocument = HydratedDocument<AssignmentSubmission>;
export declare class AssignmentSubmission {
    constructor(id?: string);
    _id: string;
    attachments: BaseMediaDto[];
    point: number;
    feedback: string;
    status: SubmissionStatus;
    assignmentId: Types.ObjectId;
    classId: Types.ObjectId;
    learnerId: Types.ObjectId;
}
export declare const AssignmentSubmissionSchema: import("mongoose").Schema<AssignmentSubmission, import("mongoose").Model<AssignmentSubmission, any, any, any, import("mongoose").Document<unknown, any, AssignmentSubmission> & AssignmentSubmission & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AssignmentSubmission, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<AssignmentSubmission>> & import("mongoose").FlatRecord<AssignmentSubmission> & Required<{
    _id: string;
}>>;
