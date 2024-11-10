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
import { SlotNumber, Weekday } from '@common/contracts/constant';
import { Types } from 'mongoose';
export declare class QueryAvailableTimeDto {
    startDate: Date;
    duration: number;
    weekdays: Weekday[];
    instructorId: Types.ObjectId;
}
declare class AvailableTimeOfGardens {
    slotNumbers: SlotNumber[];
    gardenId: Types.ObjectId;
}
export declare class ViewAvailableTimeResponse {
    slotNumbers: SlotNumber[];
    availableTimeOfGardens?: AvailableTimeOfGardens[];
    notAvailableSlotsByInstructor?: SlotNumber[];
}
declare const ViewAvailableTimeDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewAvailableTimeResponse;
}>;
export declare class ViewAvailableTimeDataResponse extends ViewAvailableTimeDataResponse_base {
}
export {};
