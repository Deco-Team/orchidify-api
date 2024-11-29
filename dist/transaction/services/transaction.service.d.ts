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
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository';
import { Transaction, TransactionDocument } from '@src/transaction/schemas/transaction.schema';
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreateTransactionDto } from '@transaction/dto/create-transaction.dto';
import { QueryTransactionDto } from '@transaction/dto/view-transaction.dto';
export declare const ITransactionService: unique symbol;
export interface ITransactionService {
    create(createTransactionDto: CreateTransactionDto, options?: SaveOptions | undefined): Promise<TransactionDocument>;
    findById(transactionId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<TransactionDocument>;
    update(conditions: FilterQuery<Transaction>, payload: UpdateQuery<Transaction>, options?: QueryOptions | undefined): Promise<TransactionDocument>;
    list(pagination: PaginationParams, queryTransactionDto: QueryTransactionDto, projection?: string | Record<string, any>, populate?: Array<PopulateOptions>): any;
    viewReportTransactionByDate({ fromDate, toDate }: {
        fromDate: Date;
        toDate: Date;
    }): Promise<any[]>;
}
export declare class TransactionService implements ITransactionService {
    private readonly transactionRepository;
    private readonly appLogger;
    constructor(transactionRepository: ITransactionRepository);
    create(createTransactionDto: CreateTransactionDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>>;
    findById(transactionId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<Transaction>, payload: UpdateQuery<Transaction>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>, never>>;
    list(pagination: PaginationParams, queryTransactionDto: QueryTransactionDto, projection?: readonly ["_id", "type", "paymentMethod", "amount", "debitAccount", "creditAccount", "description", "status", "createdAt", "updatedAt"], populate?: Array<PopulateOptions>): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>> & import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>>>;
    viewReportTransactionByDate({ fromDate, toDate }: {
        fromDate: any;
        toDate: any;
    }): Promise<any[]>;
}
