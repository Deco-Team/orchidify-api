import { SlotNumber, TimesheetType } from '@common/contracts/constant';
import { BaseSlotMetadataDto } from './slot.dto';
export declare class QueryMyTimesheetDto {
    date: Date;
    type: TimesheetType;
    learnerId: string;
}
export declare class ViewMyTimesheetItemResponse {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: string;
    classId: string;
    metadata: BaseSlotMetadataDto;
}
declare class ViewMyTimesheetListResponse {
    docs: ViewMyTimesheetItemResponse[];
}
declare const ViewMyTimesheetListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewMyTimesheetListResponse;
}>;
export declare class ViewMyTimesheetListDataResponse extends ViewMyTimesheetListDataResponse_base {
}
export {};
