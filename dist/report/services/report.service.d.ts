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
import { IReportRepository } from '@report/repositories/report.repository';
import { Report, ReportDocument } from '@report/schemas/report.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { ReportType } from '@report/contracts/constant';
export declare const IReportService: unique symbol;
export interface IReportService {
    createMany(createReportDto: any[], options?: SaveOptions | undefined): Promise<ReportDocument[]>;
    findById(reportId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<ReportDocument>;
    findByType(type: ReportType, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<ReportDocument>;
    findOne(conditions: FilterQuery<Report>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<ReportDocument>;
    update(conditions: FilterQuery<Report>, payload: UpdateQuery<Report>, options?: QueryOptions | undefined): Promise<ReportDocument>;
    findMany(conditions: FilterQuery<ReportDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<ReportDocument[]>;
}
export declare class ReportService implements IReportService {
    private readonly reportRepository;
    constructor(reportRepository: IReportRepository);
    createMany(createManyReportDto: any[], options?: SaveOptions | undefined): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>)[]>;
    findById(reportId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>>;
    findByType(type: ReportType, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>>;
    findOne(conditions: FilterQuery<Report>, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Report>, payload: UpdateQuery<Report>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>, never>>;
    findMany(conditions: FilterQuery<ReportDocument>, projection?: Record<string, any>, populates?: Array<PopulateOptions>): Promise<(import("mongoose").Document<unknown, {}, Report> & Report & Required<{
        _id: string;
    }>)[]>;
}
