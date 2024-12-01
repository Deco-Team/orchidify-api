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
import { IDResponse } from '@common/contracts/dto';
import { IPayoutRequestService } from '@payout-request/services/payout-request.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreatePayoutRequestDto } from '@payout-request/dto/create-payout-request.dto';
import { QueryPayoutRequestDto } from '@payout-request/dto/view-payout-request.dto';
import { ISettingService } from '@setting/services/setting.service';
import { IInstructorService } from '@instructor/services/instructor.service';
export declare class InstructorPayoutRequestController {
    private readonly payoutRequestService;
    private readonly settingService;
    private readonly instructorService;
    constructor(payoutRequestService: IPayoutRequestService, settingService: ISettingService, instructorService: IInstructorService);
    list(req: any, pagination: PaginationParams, queryPayoutRequestDto: QueryPayoutRequestDto): Promise<any>;
    getDetail(req: any, payoutRequestId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/payout-request.schema").PayoutRequest> & import("../schemas/payout-request.schema").PayoutRequest & Required<{
        _id: string;
    }>>;
    createPayoutRequest(req: any, createPayoutRequestDto: CreatePayoutRequestDto): Promise<IDResponse>;
    cancel(req: any, payoutRequestId: string): Promise<import("@common/contracts/dto").SuccessResponse>;
    getPayoutUsage(req: any): Promise<{
        balance: number;
        usage: number;
        count: number;
    }>;
}
