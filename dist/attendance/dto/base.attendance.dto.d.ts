import { AttendanceStatus } from '@common/contracts/constant';
export declare class BaseAttendanceDto {
    _id: string;
    status: AttendanceStatus;
    note: string;
    learnerId: string;
    slotId: string;
    classId: string;
    createdAt: Date;
    updatedAt: Date;
}
