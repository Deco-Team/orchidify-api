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
import { SlotNumber, SlotStatus } from '@common/contracts/constant';
import { Types } from 'mongoose';
import { BaseClassDto } from '@class/dto/base.class.dto';
import { ClassCourseDetailResponse, ClassGardenDetailResponse } from '@class/dto/view-class.dto';
declare const BaseSlotMetadataDto_base: import("@nestjs/common").Type<Pick<BaseClassDto, "title" | "code">>;
export declare class BaseSlotMetadataDto extends BaseSlotMetadataDto_base {
    sessionNumber?: number;
    sessionTitle?: string;
}
export declare class BaseSlotDto {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: SlotStatus;
    instructorId: string | Types.ObjectId;
    sessionId: string | Types.ObjectId;
    classId: string | Types.ObjectId;
    metadata: BaseSlotMetadataDto;
    hasTakenAttendance: boolean;
}
declare const CreateSlotDto_base: import("@nestjs/common").Type<Pick<BaseSlotDto, "metadata" | "status" | "end" | "instructorId" | "classId" | "slotNumber" | "start" | "sessionId">>;
export declare class CreateSlotDto extends CreateSlotDto_base {
    constructor(slotNumber: SlotNumber, date: Date, instructorId?: Types.ObjectId, sessionId?: Types.ObjectId, classId?: Types.ObjectId, metadata?: BaseSlotMetadataDto);
}
declare const SlotClassDetailResponse_base: import("@nestjs/common").Type<Pick<BaseClassDto, "title" | "code" | "learnerLimit" | "learnerQuantity" | "courseId">>;
declare class SlotClassDetailResponse extends SlotClassDetailResponse_base {
    course: ClassCourseDetailResponse;
}
export declare class ViewSlotDto extends BaseSlotDto {
    garden: ClassGardenDetailResponse;
    class: SlotClassDetailResponse;
    createdAt: Date;
    updatedAt: Date;
}
export {};
