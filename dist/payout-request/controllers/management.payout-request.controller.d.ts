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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { IPayoutRequestService } from '@payout-request/services/payout-request.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryPayoutRequestDto } from '@payout-request/dto/view-payout-request.dto';
import { RejectPayoutRequestDto } from '@payout-request/dto/reject-payout-request.dto';
export declare class ManagementPayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: IPayoutRequestService);
    list(pagination: PaginationParams, queryPayoutRequestDto: QueryPayoutRequestDto): Promise<any>;
    getDetail(payoutRequestId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/payout-request.schema").PayoutRequest> & import("../schemas/payout-request.schema").PayoutRequest & Required<{
        _id: string;
    }>>;
    approve(req: any, payoutRequestId: string): Promise<import("@common/contracts/dto").SuccessResponse>;
    reject(req: any, payoutRequestId: string, rejectPayoutRequestDto: RejectPayoutRequestDto): Promise<import("@common/contracts/dto").SuccessResponse>;
}
