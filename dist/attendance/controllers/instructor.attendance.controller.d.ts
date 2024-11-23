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
import { SuccessResponse } from '@common/contracts/dto';
import { AttendanceStatus } from '@common/contracts/constant';
import { IAttendanceService } from '@attendance/services/attendance.service';
import { TakeMultipleAttendanceDto } from '@attendance/dto/take-attendance.dto';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { Types } from 'mongoose';
import { ILearnerClassService } from '@class/services/learner-class.service';
export declare class InstructorAttendanceController {
    private readonly attendanceService;
    private readonly gardenTimesheetService;
    private readonly learnerClassService;
    constructor(attendanceService: IAttendanceService, gardenTimesheetService: IGardenTimesheetService, learnerClassService: ILearnerClassService);
    list(req: any, slotId: string): Promise<{
        docs: {
            status: AttendanceStatus;
            _id: string;
            enrollDate: Date;
            finishDate: Date;
            transactionId: Types.ObjectId;
            learnerId: Types.ObjectId;
            classId: Types.ObjectId;
            courseId: Types.ObjectId;
            price: number;
            discount: number;
        }[];
        slot: import("../../garden-timesheet/schemas/slot.schema").Slot;
    } | {
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/attendance.schema").Attendance> & import("../schemas/attendance.schema").Attendance & Required<{
            _id: string;
        }>)[];
        slot: import("../../garden-timesheet/schemas/slot.schema").Slot;
    }>;
    takeAttendance(req: any, slotId: string, takeMultipleAttendanceDto: TakeMultipleAttendanceDto): Promise<SuccessResponse>;
}
