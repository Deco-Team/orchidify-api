import { BaseAttendanceDto } from './base.attendance.dto';
import { AttendanceStatus } from '@common/contracts/constant';
declare const TakeAttendanceDto_base: import("@nestjs/common").Type<Pick<BaseAttendanceDto, "status" | "note" | "learnerId">>;
export declare class TakeAttendanceDto extends TakeAttendanceDto_base {
    status: AttendanceStatus;
}
export declare class TakeMultipleAttendanceDto {
    attendances: TakeAttendanceDto[];
}
export {};
