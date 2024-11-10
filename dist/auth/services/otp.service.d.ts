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
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { IOtpRepository } from '@auth/repositories/otp.repository';
import { Otp, OtpDocument } from '@auth/schemas/otp.schema';
import { CreateOtpDto } from '@auth/dto/otp.dto';
import { UserRole } from '@common/contracts/constant';
export declare const IOtpService: unique symbol;
export interface IOtpService {
    create(createOtpDto: CreateOtpDto, options?: SaveOptions | undefined): Promise<OtpDocument>;
    update(conditions: FilterQuery<Otp>, payload: UpdateQuery<Otp>, options?: QueryOptions | undefined): Promise<OtpDocument>;
    findByCode(code: string): Promise<OtpDocument>;
    findByUserIdAndRole(userId: string, role: UserRole): Promise<OtpDocument>;
    clearOtp(code: string): void;
}
export declare class OtpService implements IOtpService {
    private readonly otpRepository;
    constructor(otpRepository: IOtpRepository);
    create(createOtpDto: CreateOtpDto, options?: SaveOptions | undefined): Promise<OtpDocument>;
    update(conditions: FilterQuery<Otp>, payload: UpdateQuery<Otp>, options?: QueryOptions | undefined): Promise<OtpDocument>;
    findByCode(code: string): Promise<OtpDocument>;
    findByUserIdAndRole(userId: string, role: UserRole): Promise<OtpDocument>;
    clearOtp(code: string): Promise<void>;
}
