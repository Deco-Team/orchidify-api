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
import { CourseStatus } from '@common/contracts/constant';
import { BaseMediaDto } from '@media/dto/base-media.dto';
import { CourseLevel } from '@src/common/contracts/constant';
import { BaseSessionDto } from '@class/dto/session.dto';
import { BaseRatingSummaryDto } from '@class/dto/rating-summary.dto';
import { Types } from 'mongoose';
export declare class BaseCourseDto {
    _id: string;
    code: string;
    title: string;
    description: string;
    price: number;
    level: CourseLevel;
    type: string[];
    duration: number;
    thumbnail: string;
    media: BaseMediaDto[];
    status: CourseStatus;
    sessions: BaseSessionDto[];
    childCourseIds: string[] | Types.ObjectId[];
    learnerLimit: number;
    rate: number;
    discount: number;
    gardenRequiredToolkits: string;
    instructorId: string;
    isRequesting: Boolean;
    ratingSummary: BaseRatingSummaryDto;
    createdAt: Date;
    updatedAt: Date;
}
