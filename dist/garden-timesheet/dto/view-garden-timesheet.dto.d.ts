import { SlotNumber, TimesheetType } from '@common/contracts/constant';
import { BaseSlotMetadataDto } from './slot.dto';
export declare class QueryGardenTimesheetDto {
    gardenId: string;
    date: Date;
    type: TimesheetType;
}
export declare class ViewGardenTimesheetItemResponse {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: string;
    classId: string;
    metadata: BaseSlotMetadataDto;
}
declare class ViewGardenTimesheetListResponse {
    docs: ViewGardenTimesheetItemResponse[];
}
declare const ViewGardenTimesheetListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewGardenTimesheetListResponse;
}>;
export declare class ViewGardenTimesheetListDataResponse extends ViewGardenTimesheetListDataResponse_base {
}
export {};
