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
import { CourseStatus } from '@common/contracts/constant';
import { BaseMediaDto } from '@media/dto/base-media.dto';
import { Session } from '@class/schemas/session.schema';
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto';
export type CourseDocument = HydratedDocument<Course>;
export declare class Course {
    constructor(id?: string);
    _id: string;
    code: string;
    title: string;
    description: string;
    price: number;
    level: string;
    type: string[];
    duration: number;
    thumbnail: string;
    media: BaseMediaDto[];
    status: CourseStatus;
    sessions: Session[];
    childCourseIds: Types.ObjectId[];
    learnerLimit: number;
    rate: number;
    discount: number;
    gardenRequiredToolkits: string;
    instructorId: Types.ObjectId;
    isRequesting: boolean;
    ratingSummary: BaseRatingSummaryDto;
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, import("mongoose").Document<unknown, any, Course> & Course & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & Required<{
    _id: string;
}>>;
