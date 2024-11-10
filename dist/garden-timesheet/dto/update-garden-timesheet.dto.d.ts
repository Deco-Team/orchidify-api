import { BaseGardenTimesheetDto } from './base.garden-timesheet.dto';
declare const UpdateGardenTimesheetDto_base: import("@nestjs/common").Type<Pick<BaseGardenTimesheetDto, "status" | "gardenId">>;
export declare class UpdateGardenTimesheetDto extends UpdateGardenTimesheetDto_base {
    date: Date;
}
export {};
