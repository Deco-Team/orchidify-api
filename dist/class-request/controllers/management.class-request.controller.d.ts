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
import { IClassRequestService } from '@class-request/services/class-request.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryClassRequestDto } from '@class-request/dto/view-class-request.dto';
import { RejectClassRequestDto } from '@class-request/dto/reject-class-request.dto';
import { ApproveClassRequestDto } from '@class-request/dto/approve-class-request.dto';
export declare class ManagementClassRequestController {
    private readonly classRequestService;
    constructor(classRequestService: IClassRequestService);
    list(pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto): Promise<any>;
    getDetail(classRequestId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/class-request.schema").ClassRequest> & import("../schemas/class-request.schema").ClassRequest & Required<{
        _id: string;
    }>>;
    approve(req: any, classRequestId: string, approveClassRequestDto: ApproveClassRequestDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    reject(req: any, classRequestId: string, RejectClassRequestDto: RejectClassRequestDto): Promise<import("@common/contracts/dto").SuccessResponse>;
}
