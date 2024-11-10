import { SlotNumber, TimesheetType } from '@common/contracts/constant';
import { BaseSlotMetadataDto } from './slot.dto';
export declare class QueryInstructorTimesheetDto {
    date: Date;
    type: TimesheetType;
    instructorId: string;
}
declare const QueryTeachingTimesheetDto_base: import("@nestjs/common").Type<Pick<QueryInstructorTimesheetDto, "type" | "date">>;
export declare class QueryTeachingTimesheetDto extends QueryTeachingTimesheetDto_base {
    instructorId: string;
}
export declare class ViewTeachingTimesheetItemResponse {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: string;
    classId: string;
    metadata: BaseSlotMetadataDto;
}
declare class ViewTeachingTimesheetListResponse {
    docs: ViewTeachingTimesheetItemResponse[];
}
declare const ViewTeachingTimesheetListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewTeachingTimesheetListResponse;
}>;
export declare class ViewTeachingTimesheetListDataResponse extends ViewTeachingTimesheetListDataResponse_base {
}
export {};
