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
import { ClassRequestStatus, ClassRequestType } from '@common/contracts/constant';
import { ClassRequestStatusHistory } from '@src/class-request/schemas/class-request.schema';
import { Types } from 'mongoose';
import { BaseClassDto } from '@class/dto/base.class.dto';
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto';
declare class BaseClassRequestMetadataDto extends BaseClassDto {
}
export declare class BaseClassRequestDto {
    _id: string;
    type: ClassRequestType;
    status: ClassRequestStatus;
    rejectReason: string;
    histories: ClassRequestStatusHistory[];
    description: string;
    metadata: BaseClassRequestMetadataDto;
    createdBy: Types.ObjectId | BaseInstructorDto;
    courseId: Types.ObjectId | string;
    classId: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
