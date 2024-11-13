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
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { HelperService } from '@common/services/helper.service';
import { CreateCertificateDto } from '@certificate/dto/create-certificate.dto';
import { QueryCertificateDto } from '@certificate/dto/view-certificate.dto';
import { ICertificateRepository } from '@certificate/repositories/certificate.repository';
import { Certificate, CertificateDocument } from '@certificate/schemas/certificate.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
export declare const ICertificateService: unique symbol;
export interface ICertificateService {
    create(createCertificateDto: CreateCertificateDto, options?: SaveOptions | undefined): Promise<CertificateDocument>;
    findById(certificateId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<CertificateDocument>;
    update(conditions: FilterQuery<Certificate>, payload: UpdateQuery<Certificate>, options?: QueryOptions | undefined): Promise<CertificateDocument>;
    list(pagination: PaginationParams, queryCertificateDto: QueryCertificateDto): any;
    generateCertificateCode(length?: number, startTime?: number): string;
}
export declare class CertificateService implements ICertificateService {
    private readonly certificateRepository;
    private readonly helperService;
    constructor(certificateRepository: ICertificateRepository, helperService: HelperService);
    create(createCertificateDto: CreateCertificateDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>>;
    findById(certificateId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Certificate>, payload: UpdateQuery<CertificateDocument>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryCertificateDto: QueryCertificateDto, projection?: readonly ["_id", "name", "code", "url", "ownerId", "createdAt", "updatedAt"]): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: string;
    }>>>;
    generateCertificateCode(length?: number, startTime?: number): any;
}
