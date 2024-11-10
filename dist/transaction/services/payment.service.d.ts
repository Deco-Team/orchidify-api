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
import { CreateMomoPaymentDto, MomoPaymentResponseDto, QueryMomoPaymentDto, RefundMomoPaymentDto } from '@src/transaction/dto/momo-payment.dto';
import { MomoPaymentStrategy } from '@src/transaction/strategies/momo.strategy';
import { Connection, FilterQuery } from 'mongoose';
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository';
import { PaymentMethod } from '@src/transaction/contracts/constant';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { Transaction } from '@src/transaction/schemas/transaction.schema';
import { PayOSPaymentStrategy } from '@src/transaction/strategies/payos.strategy';
import { WebhookType as PayOSWebhookData } from '@payos/node/lib/type';
import { ZaloPayPaymentStrategy } from '@src/transaction/strategies/zalopay.strategy';
import { StripePaymentStrategy } from '@transaction/strategies/stripe.strategy';
import { CreateStripePaymentDto, QueryStripePaymentDto, RefundStripePaymentDto } from '@transaction/dto/stripe-payment.dto';
export declare const IPaymentService: unique symbol;
export interface IPaymentService {
    setStrategy(paymentMethod: PaymentMethod): void;
    verifyPaymentWebhookData(webhookData: any): any;
    createTransaction(createPaymentDto: any): any;
    getTransaction(queryPaymentDto: QueryMomoPaymentDto | QueryStripePaymentDto): any;
    refundTransaction(refundPaymentDto: RefundMomoPaymentDto | RefundStripePaymentDto): any;
    getRefundTransaction(queryPaymentDto: QueryMomoPaymentDto): any;
    getPaymentList(filter: any, paginationParams: PaginationParams): Promise<any>;
    processWebhook(webhookData: MomoPaymentResponseDto | PayOSWebhookData): Promise<any>;
}
export declare class PaymentService implements IPaymentService {
    readonly connection: Connection;
    private readonly transactionRepository;
    private readonly momoPaymentStrategy;
    private readonly zaloPayPaymentStrategy;
    private readonly payOSPaymentStrategy;
    private readonly stripePaymentStrategy;
    private strategy;
    private readonly logger;
    constructor(connection: Connection, transactionRepository: ITransactionRepository, momoPaymentStrategy: MomoPaymentStrategy, zaloPayPaymentStrategy: ZaloPayPaymentStrategy, payOSPaymentStrategy: PayOSPaymentStrategy, stripePaymentStrategy: StripePaymentStrategy);
    setStrategy(paymentMethod: PaymentMethod): void;
    verifyPaymentWebhookData(webhookData: any): any;
    createTransaction(createPaymentDto: CreateMomoPaymentDto | CreateStripePaymentDto): any;
    getTransaction(queryPaymentDto: QueryMomoPaymentDto | QueryStripePaymentDto): any;
    refundTransaction(refundPaymentDto: RefundMomoPaymentDto | RefundStripePaymentDto): any;
    getRefundTransaction(queryPaymentDto: any): any;
    getPaymentList(filter: FilterQuery<Transaction>, paginationParams: PaginationParams): Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, import("mongoose").PaginateOptions, import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, Transaction> & Transaction & Required<{
        _id: string;
    }>, never>>>;
    processWebhook(webhookData: MomoPaymentResponseDto | PayOSWebhookData): Promise<any>;
}
