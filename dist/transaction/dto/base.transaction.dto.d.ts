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
import { TransactionStatus, UserRole } from '@common/contracts/constant';
import { PaymentMethod, TransactionType } from '@src/transaction/contracts/constant';
import { Types } from 'mongoose';
export declare class BaseTransactionAccountDto {
    userId?: Types.ObjectId;
    userRole: UserRole;
}
export declare class BasePaymentDto {
    id: string;
    code: string;
    createdAt: Date;
    status: string;
    description?: string;
    orderInfo?: string;
    histories?: BasePaymentDto[];
}
export declare class BasePayoutDto {
    id: string;
    code: string;
    createdAt: Date;
    status: string;
    histories?: BasePayoutDto[];
}
export declare class BaseTransactionDto {
    _id: string;
    type: TransactionType;
    paymentMethod?: PaymentMethod;
    amount: number;
    debitAccount: BaseTransactionAccountDto;
    creditAccount: BaseTransactionAccountDto;
    description: string;
    status: TransactionStatus;
    payment?: BasePaymentDto;
    payout?: BasePayoutDto;
    createdAt: Date;
    updatedAt: Date;
}
