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
import { BaseGardenDto } from '@garden/dto/base.garden.dto';
import { Types } from 'mongoose';
export declare class QueryAvailableGardenDto {
    startDate: Date;
    duration: number;
    weekdays: Weekday[];
    slotNumbers: SlotNumber[];
    instructorId: Types.ObjectId;
}
declare const AvailableGardenListItemResponse_base: import("@nestjs/common").Type<Pick<BaseGardenDto, "name" | "_id">>;
export declare class AvailableGardenListItemResponse extends AvailableGardenListItemResponse_base {
}
declare class AvailableGardenListResponse {
    docs: AvailableGardenListItemResponse[];
}
declare const AvailableGardenListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof AvailableGardenListResponse;
}>;
export declare class AvailableGardenListDataResponse extends AvailableGardenListDataResponse_base {
}
export {};
