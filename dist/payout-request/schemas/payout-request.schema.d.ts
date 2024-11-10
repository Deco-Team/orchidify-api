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
import { PayoutRequestStatus, UserRole } from '@common/contracts/constant';
export type PayoutRequestDocument = HydratedDocument<PayoutRequest>;
export declare class PayoutRequestStatusHistory {
    status: PayoutRequestStatus;
    timestamp: Date;
    userId: Types.ObjectId;
    userRole: UserRole;
}
export declare class PayoutRequest {
    constructor(id?: string);
    _id: string;
    amount: number;
    status: PayoutRequestStatus;
    rejectReason: string;
    histories: PayoutRequestStatusHistory[];
    description: string;
    createdBy: Types.ObjectId;
    handledBy: Types.ObjectId;
    transactionId: Types.ObjectId;
}
export declare const PayoutRequestSchema: import("mongoose").Schema<PayoutRequest, import("mongoose").Model<PayoutRequest, any, any, any, import("mongoose").Document<unknown, any, PayoutRequest> & PayoutRequest & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PayoutRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<PayoutRequest>> & import("mongoose").FlatRecord<PayoutRequest> & Required<{
    _id: string;
}>>;
