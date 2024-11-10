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
import { IClassService } from '@class/services/class.service';
import { ILearnerClassService } from '@class/services/learner-class.service';
import { HelperService } from '@common/services/helper.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateMomoPaymentDto, MomoPaymentResponseDto, QueryMomoPaymentDto, RefundMomoPaymentDto } from '@src/transaction/dto/momo-payment.dto';
import { ITransactionRepository } from '@src/transaction/repositories/transaction.repository';
import { IPaymentStrategy } from '@src/transaction/strategies/payment-strategy.interface';
import { Connection } from 'mongoose';
import { NotificationAdapter } from '@common/adapters/notification.adapter';
import { ILearnerService } from '@learner/services/learner.service';
export declare class MomoPaymentStrategy implements IPaymentStrategy {
    readonly connection: Connection;
    private readonly httpService;
    private readonly configService;
    private readonly helperService;
    private readonly notificationAdapter;
    private readonly transactionRepository;
    private readonly classService;
    private readonly learnerClassService;
    private readonly learnerService;
    private readonly logger;
    private config;
    constructor(connection: Connection, httpService: HttpService, configService: ConfigService, helperService: HelperService, notificationAdapter: NotificationAdapter, transactionRepository: ITransactionRepository, classService: IClassService, learnerClassService: ILearnerClassService, learnerService: ILearnerService);
    createTransaction(createMomoPaymentDto: CreateMomoPaymentDto): Promise<any>;
    getTransaction(queryDto: QueryMomoPaymentDto): Promise<any>;
    refundTransaction(refundDto: RefundMomoPaymentDto): Promise<any>;
    getRefundTransaction(queryDto: QueryMomoPaymentDto): Promise<any>;
    processWebhook(webhookData: MomoPaymentResponseDto): Promise<boolean>;
    verifyPaymentWebhookData(momoPaymentResponseDto: any): boolean;
    private sendNotificationWhenPaymentSuccess;
}
