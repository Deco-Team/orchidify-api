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
import { PayoutRequestStatus } from '@common/contracts/constant';
import { PayoutRequestStatusHistory } from '@src/payout-request/schemas/payout-request.schema';
import { Types } from 'mongoose';
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto';
import { BaseStaffDto } from '@staff/dto/base.staff.dto';
export declare class BasePayoutRequestDto {
    _id: string;
    amount: number;
    status: PayoutRequestStatus;
    rejectReason: string;
    histories: PayoutRequestStatusHistory[];
    description: string;
    createdBy: Types.ObjectId | BaseInstructorDto;
    handledBy: Types.ObjectId | BaseStaffDto;
    transactionId: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}
