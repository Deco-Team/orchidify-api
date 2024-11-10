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
import * as moment from 'moment-timezone';
import { IClassRepository } from '@src/class/repositories/class.repository';
import { Class, ClassDocument } from '@src/class/schemas/class.schema';
import { Connection, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreateClassDto } from '@class/dto/create-class.dto';
import { ClassStatus, SlotNumber, Weekday } from '@common/contracts/constant';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassDto } from '@src/class/dto/view-class.dto';
import { CreateMomoPaymentResponse } from '@src/transaction/dto/momo-payment.dto';
import { ConfigService } from '@nestjs/config';
import { IPaymentService } from '@src/transaction/services/payment.service';
import { EnrollClassDto } from '@class/dto/enroll-class.dto';
import { ILearnerService } from '@learner/services/learner.service';
import { ITransactionService } from '@transaction/services/transaction.service';
import { ILearnerClassService } from './learner-class.service';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { UserAuth } from '@common/contracts/dto';
import { ISettingService } from '@setting/services/setting.service';
import { IInstructorService } from '@instructor/services/instructor.service';
import { CancelClassDto } from '@class/dto/cancel-class.dto';
import { NotificationAdapter } from '@common/adapters/notification.adapter';
export declare const IClassService: unique symbol;
export interface IClassService {
    create(courseClass: CreateClassDto, options?: SaveOptions | undefined): Promise<ClassDocument>;
    findById(classId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<ClassDocument>;
    update(conditions: FilterQuery<Class>, payload: UpdateQuery<Class>, options?: QueryOptions | undefined): Promise<ClassDocument>;
    listByInstructor(instructorId: string, pagination: PaginationParams, queryClassDto: QueryClassDto): any;
    listByStaff(pagination: PaginationParams, queryClassDto: QueryClassDto): any;
    findManyByStatus(status: ClassStatus[]): Promise<ClassDocument[]>;
    findManyByInstructorIdAndStatus(instructorId: string, status: ClassStatus[]): Promise<ClassDocument[]>;
    findManyByGardenIdAndStatus(gardenId: string, status: ClassStatus[]): Promise<ClassDocument[]>;
    findMany(conditions: FilterQuery<ClassDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<ClassDocument[]>;
    generateCode(): Promise<string>;
    enrollClass(enrollClassDto: EnrollClassDto): Promise<CreateMomoPaymentResponse>;
    completeClass(classId: string, userAuth: UserAuth): Promise<void>;
    cancelClass(classId: string, cancelClassDto: CancelClassDto, userAuth: UserAuth): Promise<void>;
    getClassEndTime(params: {
        startDate: Date;
        duration: number;
        weekdays: Weekday[];
        slotNumbers?: SlotNumber[];
    }): moment.Moment;
}
export declare class ClassService implements IClassService {
    private readonly notificationAdapter;
    readonly connection: Connection;
    private readonly classRepository;
    private readonly configService;
    private readonly paymentService;
    private readonly transactionService;
    private readonly learnerService;
    private readonly learnerClassService;
    private readonly gardenTimesheetService;
    private readonly settingService;
    private readonly instructorService;
    constructor(notificationAdapter: NotificationAdapter, connection: Connection, classRepository: IClassRepository, configService: ConfigService, paymentService: IPaymentService, transactionService: ITransactionService, learnerService: ILearnerService, learnerClassService: ILearnerClassService, gardenTimesheetService: IGardenTimesheetService, settingService: ISettingService, instructorService: IInstructorService);
    create(createClassDto: CreateClassDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>>;
    findById(classId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Class>, payload: UpdateQuery<Class>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>, never>>;
    listByInstructor(instructorId: string, pagination: PaginationParams, queryClassDto: QueryClassDto, projection?: readonly ["_id", "code", "title", "startDate", "price", "level", "type", "duration", "thumbnail", "status", "learnerLimit", "learnerQuantity", "weekdays", "slotNumbers", "rate", "ratingSummary", "courseId", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>>>;
    listByStaff(pagination: PaginationParams, queryClassDto: QueryClassDto, projection?: readonly ["_id", "code", "title", "startDate", "price", "level", "type", "duration", "thumbnail", "status", "learnerLimit", "learnerQuantity", "weekdays", "slotNumbers", "rate", "ratingSummary", "courseId", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>>>;
    findManyByStatus(status: ClassStatus[]): Promise<ClassDocument[]>;
    findManyByInstructorIdAndStatus(instructorId: string, status: ClassStatus[]): Promise<ClassDocument[]>;
    findManyByGardenIdAndStatus(gardenId: string, status: ClassStatus[]): Promise<ClassDocument[]>;
    findMany(conditions: FilterQuery<ClassDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Class> & Class & Required<{
        _id: string;
    }>)[]>;
    generateCode(): Promise<string>;
    enrollClass(enrollClassDto: EnrollClassDto): Promise<any>;
    private checkDuplicateTimesheetWithMyClasses;
    private getNotAvailableSlots;
    private processPaymentWithMomo;
    private processPaymentWithStripe;
    completeClass(classId: string, userAuth: UserAuth): Promise<void>;
    getClassEndTime(params: {
        startDate: Date;
        duration: number;
        weekdays: Weekday[];
        slotNumbers?: SlotNumber[];
    }): moment.Moment;
    cancelClass(classId: string, cancelClassDto: CancelClassDto, userAuth: UserAuth): Promise<void>;
    private sendCancelClassNotificationForLearner;
}
