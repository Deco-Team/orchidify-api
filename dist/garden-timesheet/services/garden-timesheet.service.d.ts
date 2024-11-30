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
import { IGardenTimesheetRepository } from '@garden-timesheet/repositories/garden-timesheet.repository';
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema';
import { FilterQuery, PopulateOptions, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { QueryGardenTimesheetDto } from '@garden-timesheet/dto/view-garden-timesheet.dto';
import { SlotNumber, SlotStatus, Weekday } from '@common/contracts/constant';
import { QueryTeachingTimesheetDto } from '@garden-timesheet/dto/view-teaching-timesheet.dto';
import { QueryAvailableTimeDto, ViewAvailableTimeResponse } from '@garden-timesheet/dto/view-available-timesheet.dto';
import { Slot } from '@garden-timesheet/schemas/slot.schema';
import { Garden } from '@garden/schemas/garden.schema';
import { IGardenRepository } from '@garden/repositories/garden.repository';
import { BaseSlotMetadataDto } from '@garden-timesheet/dto/slot.dto';
import { HelperService } from '@common/services/helper.service';
import { Course } from '@course/schemas/course.schema';
import { IClassService } from '@class/services/class.service';
import { QueryMyTimesheetDto } from '@garden-timesheet/dto/view-my-timesheet.dto';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { QuerySlotByGardenIdsDto, QueryInactiveTimesheetByGardenDto } from '@garden-timesheet/dto/garden-manager-view-timesheet.dto';
export declare const IGardenTimesheetService: unique symbol;
export interface IGardenTimesheetService {
    findById(gardenTimesheetId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenTimesheetDocument>;
    findOneBy(conditions: FilterQuery<GardenTimesheet>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenTimesheetDocument>;
    update(conditions: FilterQuery<GardenTimesheet>, payload: UpdateQuery<GardenTimesheet>, options?: QueryOptions | undefined): Promise<GardenTimesheetDocument>;
    viewGardenTimesheetList(queryGardenTimesheetDto: QueryGardenTimesheetDto, garden: Garden): Promise<GardenTimesheetDocument[]>;
    viewTeachingTimesheet(queryTeachingTimesheetDto: QueryTeachingTimesheetDto): Promise<GardenTimesheetDocument[]>;
    viewMyTimesheet(queryMyTimesheetDto: QueryMyTimesheetDto): Promise<GardenTimesheetDocument[]>;
    viewSlotsByGardenIds(querySlotByGardenIdsDto: QuerySlotByGardenIdsDto): Promise<GardenTimesheetDocument[]>;
    viewInactiveTimesheetByGarden(queryInactiveTimesheetByGardenDto: QueryInactiveTimesheetByGardenDto): Promise<GardenTimesheetDocument[]>;
    viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse>;
    generateSlotsForClass(params: {
        startDate: Date;
        duration: number;
        weekdays: Weekday[];
        slotNumbers: SlotNumber[];
        gardenId: Types.ObjectId;
        instructorId: Types.ObjectId;
        classId: Types.ObjectId;
        metadata: BaseSlotMetadataDto;
        courseData: Course;
    }, options?: QueryOptions | undefined): Promise<boolean>;
    findSlotBy(params: {
        slotId: string;
        instructorId?: string;
    }): Promise<Slot>;
    findMany(conditions: FilterQuery<GardenTimesheetDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<GardenTimesheetDocument[]>;
    updateMany(conditions: FilterQuery<GardenTimesheetDocument>, payload: UpdateQuery<GardenTimesheetDocument>, options?: import('mongodb').UpdateOptions | null): Promise<void>;
}
export declare class GardenTimesheetService implements IGardenTimesheetService {
    private readonly gardenTimesheetRepository;
    private readonly gardenRepository;
    private readonly helperService;
    private readonly classService;
    private readonly learnerClassService;
    private readonly appLogger;
    constructor(gardenTimesheetRepository: IGardenTimesheetRepository, gardenRepository: IGardenRepository, helperService: HelperService, classService: IClassService, learnerClassService: ILearnerClassService);
    findById(gardenTimesheetId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, GardenTimesheet> & GardenTimesheet & Required<{
        _id: string;
    }>>;
    findOneBy(conditions: FilterQuery<GardenTimesheet>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, GardenTimesheet> & GardenTimesheet & Required<{
        _id: string;
    }>>;
    findSlotBy(params: {
        slotId: string;
        instructorId?: string;
    }): Promise<{
        garden: import("mongoose").Document<unknown, {}, Garden> & Garden & Required<{
            _id: string;
        }>;
        class: import("mongoose").Document<unknown, {}, import("../../class/schemas/class.schema").Class> & import("../../class/schemas/class.schema").Class & Required<{
            _id: string;
        }>;
        _id: string;
        slotNumber: SlotNumber;
        start: Date;
        end: Date;
        status: SlotStatus;
        instructorId: Types.ObjectId;
        sessionId: Types.ObjectId;
        classId: Types.ObjectId;
        metadata: Record<string, any>;
        hasTakenAttendance: boolean;
        createdAt: any;
        updatedAt: any;
    }>;
    update(conditions: FilterQuery<GardenTimesheet>, payload: UpdateQuery<GardenTimesheet>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, GardenTimesheet> & GardenTimesheet & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, GardenTimesheet> & GardenTimesheet & Required<{
        _id: string;
    }>, never>>;
    viewGardenTimesheetList(queryGardenTimesheetDto: QueryGardenTimesheetDto, garden: Garden): Promise<any[]>;
    viewTeachingTimesheet(queryTeachingTimesheetDto: QueryTeachingTimesheetDto): Promise<GardenTimesheetDocument[]>;
    viewSlotsByGardenIds(querySlotByGardenIdsDto: QuerySlotByGardenIdsDto): Promise<GardenTimesheetDocument[]>;
    viewMyTimesheet(queryMyTimesheetDto: QueryMyTimesheetDto): Promise<GardenTimesheetDocument[]>;
    viewInactiveTimesheetByGarden(queryInactiveTimesheetByGardenDto: QueryInactiveTimesheetByGardenDto): Promise<any[]>;
    viewAvailableTime(queryAvailableTimeDto: QueryAvailableTimeDto): Promise<ViewAvailableTimeResponse>;
    generateSlotsForClass(params: {
        startDate: Date;
        duration: number;
        weekdays: Weekday[];
        slotNumbers: SlotNumber[];
        gardenId: Types.ObjectId;
        instructorId: Types.ObjectId;
        classId: Types.ObjectId;
        metadata: BaseSlotMetadataDto;
        courseData: Course;
    }, options?: QueryOptions | undefined): Promise<boolean>;
    findMany(conditions: FilterQuery<GardenTimesheetDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, GardenTimesheet> & GardenTimesheet & Required<{
        _id: string;
    }>)[]>;
    updateMany(conditions: FilterQuery<GardenTimesheetDocument>, payload: UpdateQuery<GardenTimesheetDocument>, options?: import('mongodb').UpdateOptions | null): Promise<void>;
    private generateTimesheetOfMonth;
    private generateAllTimesheetOfMonth;
    private generateAllTimesheetFromDateRange;
    private transformDataToCalendar;
    private transformDataToTeachingCalendar;
    private transformDataToMyCalendar;
    private transformDataToGardenIdsCalendar;
}
