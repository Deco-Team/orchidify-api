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
import { IInstructorRepository } from '@instructor/repositories/instructor.repository';
import { Instructor, InstructorDocument } from '@instructor/schemas/instructor.schema';
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { IAuthUserService } from '@auth/services/auth.service';
import { QueryInstructorDto } from '@instructor/dto/view-instructor.dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreateInstructorDto } from '@instructor/dto/create-instructor.dto';
import { HelperService } from '@common/services/helper.service';
import { INotificationService } from '@notification/services/notification.service';
export declare const IInstructorService: unique symbol;
export interface IInstructorService extends IAuthUserService {
    create(createInstructorDto: CreateInstructorDto, options?: SaveOptions | undefined): Promise<InstructorDocument>;
    findById(instructorId: string, projection?: string | Record<string, any>): Promise<InstructorDocument>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<InstructorDocument>;
    update(conditions: FilterQuery<Instructor>, payload: UpdateQuery<Instructor>, options?: QueryOptions | undefined): Promise<InstructorDocument>;
    list(pagination: PaginationParams, queryLearnerDto: QueryInstructorDto): any;
}
export declare class InstructorService implements IInstructorService {
    private readonly helperService;
    private readonly instructorRepository;
    private readonly notificationService;
    constructor(helperService: HelperService, instructorRepository: IInstructorRepository, notificationService: INotificationService);
    create(createInstructorDto: CreateInstructorDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>>;
    findById(instructorId: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>>;
    findByEmail(email: string, projection?: string | Record<string, any>): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Instructor>, payload: UpdateQuery<Instructor>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryLearnerDto: QueryInstructorDto, projection?: readonly ["_id", "name", "phone", "email", "dateOfBirth", "bio", "idCardPhoto", "avatar", "status", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Instructor> & Instructor & Required<{
        _id: string;
    }>>>;
}
