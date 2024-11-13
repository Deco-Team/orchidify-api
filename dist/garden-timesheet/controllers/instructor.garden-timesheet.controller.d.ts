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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { QueryTeachingTimesheetDto } from '@garden-timesheet/dto/view-teaching-timesheet.dto';
import { QueryAvailableTimeDto } from '@garden-timesheet/dto/view-available-timesheet.dto';
export declare class InstructorGardenTimesheetController {
    private readonly gardenTimesheetService;
    constructor(gardenTimesheetService: IGardenTimesheetService);
    viewAvailableTime(req: any, queryAvailableTimeDto: QueryAvailableTimeDto): Promise<import("@garden-timesheet/dto/view-available-timesheet.dto").ViewAvailableTimeResponse>;
    viewTeachingTimesheet(req: any, queryTeachingTimesheetDto: QueryTeachingTimesheetDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/garden-timesheet.schema").GardenTimesheet> & import("../schemas/garden-timesheet.schema").GardenTimesheet & Required<{
            _id: string;
        }>)[];
    }>;
    getSlotDetail(req: any, slotId: string): Promise<import("../schemas/slot.schema").Slot>;
}