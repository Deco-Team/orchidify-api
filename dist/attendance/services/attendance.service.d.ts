/// <reference types="mongoose-paginate-v2" />
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
import { IAttendanceRepository } from '@attendance/repositories/attendance.repository';
import { Attendance, AttendanceDocument } from '@attendance/schemas/attendance.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { TakeAttendanceDto } from '@attendance/dto/take-attendance.dto';
import { QueryAttendanceDto } from '@attendance/dto/view-attendance.dto';
export declare const IAttendanceService: unique symbol;
export interface IAttendanceService {
    create(takeAttendanceDto: TakeAttendanceDto, options?: SaveOptions | undefined): Promise<AttendanceDocument>;
    findById(attendanceId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<AttendanceDocument>;
    findOneBy(conditions: FilterQuery<Attendance>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<AttendanceDocument>;
    findMany(conditions: FilterQuery<AttendanceDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<AttendanceDocument[]>;
    update(conditions: FilterQuery<Attendance>, payload: UpdateQuery<Attendance>, options?: QueryOptions | undefined): Promise<AttendanceDocument>;
    list(queryAttendanceDto: QueryAttendanceDto, projection?: string | Record<string, any>, populate?: Array<PopulateOptions>): any;
    bulkWrite(slotId: string, takeAttendanceDto: TakeAttendanceDto[], classId: string): any;
}
export declare class AttendanceService implements IAttendanceService {
    private readonly attendanceRepository;
    private readonly appLogger;
    constructor(attendanceRepository: IAttendanceRepository);
    create(takeAttendanceDto: TakeAttendanceDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Attendance>, payload: UpdateQuery<Attendance>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>, never>>;
    bulkWrite(slotId: string, takeAttendanceDto: TakeAttendanceDto[], classId: string): Promise<import("mongodb").BulkWriteResult>;
    findById(attendanceId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<Attendance>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>>;
    findMany(conditions: FilterQuery<AttendanceDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>)[]>;
    list(queryCourseDto: QueryAttendanceDto, projection?: readonly ["_id", "status", "note", "learnerId", "createdAt", "updatedAt"], populate?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Attendance> & Attendance & Required<{
        _id: string;
    }>>>;
}
