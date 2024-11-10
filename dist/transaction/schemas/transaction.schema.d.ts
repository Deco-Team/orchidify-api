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
import { HydratedDocument, Types } from 'mongoose';
import { TransactionStatus, UserRole } from '@common/contracts/constant';
import { PaymentMethod, TransactionType } from '@src/transaction/contracts/constant';
export declare class TransactionAccount {
    userId: Types.ObjectId;
    userRole: UserRole;
}
export declare class Payment {
    id: string;
    code: string;
    createdAt: Date;
    status: string;
    histories: Payment[];
}
export declare class Payout {
    id: string;
    code: string;
    createdAt: Date;
    status: string;
    histories: Payout[];
}
export type TransactionDocument = HydratedDocument<Transaction>;
export declare class Transaction {
    constructor(id?: string);
    _id: string;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    amount: number;
    debitAccount: TransactionAccount;
    creditAccount: TransactionAccount;
    description: string;
    status: TransactionStatus;
    payment: Payment;
    payout: Payout;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Transaction>> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: string;
}>>;
