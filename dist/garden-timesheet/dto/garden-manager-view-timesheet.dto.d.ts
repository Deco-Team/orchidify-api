import { SlotNumber, TimesheetType } from '@common/contracts/constant';
import { BaseSlotMetadataDto } from './slot.dto';
import { BaseGardenDto } from '@garden/dto/base.garden.dto';
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto';
export declare class QuerySlotByGardenIdsDto {
    date: Date;
    type: TimesheetType;
    gardenIds: string[];
}
declare const QueryInactiveTimesheetByGardenDto_base: import("@nestjs/common").Type<Pick<QuerySlotByGardenIdsDto, "date">>;
export declare class QueryInactiveTimesheetByGardenDto extends QueryInactiveTimesheetByGardenDto_base {
    gardenId: string;
}
declare const SLotInstructorDetailResponse_base: import("@nestjs/common").Type<Pick<BaseInstructorDto, "name">>;
declare class SLotInstructorDetailResponse extends SLotInstructorDetailResponse_base {
}
declare const SlotGardenDetailResponse_base: import("@nestjs/common").Type<Pick<BaseGardenDto, "name">>;
declare class SlotGardenDetailResponse extends SlotGardenDetailResponse_base {
}
export declare class ViewSlotItemResponse {
    _id: string;
    slotNumber: SlotNumber;
    start: Date;
    end: Date;
    status: string;
    classId: string;
    metadata: BaseSlotMetadataDto;
    instructor: SLotInstructorDetailResponse;
    garden: SlotGardenDetailResponse;
}
declare class ViewSlotListResponse {
    docs: ViewSlotItemResponse[];
}
declare const ViewSlotListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewSlotListResponse;
}>;
export declare class ViewSlotListDataResponse extends ViewSlotListDataResponse_base {
}
export {};
