import { SlotNumber, TimesheetType } from '@common/contracts/constant';
import { BaseSlotDto, BaseSlotMetadataDto } from './slot.dto';
import { BaseGardenDto } from '@garden/dto/base.garden.dto';
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto';
export declare class QueryMyTimesheetDto {
    date: Date;
    type: TimesheetType;
    learnerId: string;
}
declare const MyTimesheetInstructorDetailResponse_base: import("@nestjs/common").Type<Pick<BaseInstructorDto, "name">>;
declare class MyTimesheetInstructorDetailResponse extends MyTimesheetInstructorDetailResponse_base {
}
declare const MyTimesheetGardenDetailResponse_base: import("@nestjs/common").Type<Pick<BaseGardenDto, "name">>;
declare class MyTimesheetGardenDetailResponse extends MyTimesheetGardenDetailResponse_base {
}
declare const MyTimesheetAttendanceDetailResponse_base: import("@nestjs/common").Type<Pick<BaseSlotDto, "status">>;
declare class MyTimesheetAttendanceDetailResponse extends MyTimesheetAttendanceDetailResponse_base {
}
export declare class ViewMyTimesheetItemResponse {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: string;
    classId: string;
    metadata: BaseSlotMetadataDto;
    instructor: MyTimesheetInstructorDetailResponse;
    garden: MyTimesheetGardenDetailResponse;
    attendance: MyTimesheetAttendanceDetailResponse;
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
