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
import { SuccessResponse } from '@common/contracts/dto';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto';
import { IGardenService } from '@garden/services/garden.service';
import { QueryInstructorTimesheetDto } from '@garden-timesheet/dto/view-teaching-timesheet.dto';
import { UpdateGardenTimesheetDto } from '@garden-timesheet/dto/update-garden-timesheet.dto';
import { INotificationService } from '@notification/services/notification.service';
export declare class ManagementGardenTimesheetController {
    private readonly gardenTimesheetService;
    private readonly gardenService;
    private readonly notificationService;
    constructor(gardenTimesheetService: IGardenTimesheetService, gardenService: IGardenService, notificationService: INotificationService);
    viewGardenTimesheet(req: any, queryGardenTimesheetDto: QueryGardenTimesheetDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/garden-timesheet.schema").GardenTimesheet> & import("../schemas/garden-timesheet.schema").GardenTimesheet & Required<{
            _id: string;
        }>)[];
    }>;
    viewInstructorTimesheet(queryTeachingTimesheetDto: QueryInstructorTimesheetDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/garden-timesheet.schema").GardenTimesheet> & import("../schemas/garden-timesheet.schema").GardenTimesheet & Required<{
            _id: string;
        }>)[];
    }>;
    updateGardenTimesheet(updateGardenTimesheetDto: UpdateGardenTimesheetDto): Promise<SuccessResponse>;
}
