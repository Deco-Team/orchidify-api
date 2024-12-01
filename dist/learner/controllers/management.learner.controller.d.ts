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
import { SuccessResponse } from '@common/contracts/dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { IUserTokenService } from '@auth/services/user-token.service';
import { ILearnerService } from '@learner/services/learner.service';
import { QueryLearnerDto } from '@learner/dto/view-learner.dto';
import { IReportService } from '@report/services/report.service';
export declare class ManagementLearnerController {
    private readonly learnerService;
    private readonly userTokenService;
    private readonly reportService;
    constructor(learnerService: ILearnerService, userTokenService: IUserTokenService, reportService: IReportService);
    list(pagination: PaginationParams, queryLearnerDto: QueryLearnerDto): Promise<any>;
    getDetail(learnerId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/learner.schema").Learner> & import("../schemas/learner.schema").Learner & Required<{
        _id: string;
    }>>;
    deactivate(learnerId: string): Promise<SuccessResponse>;
    activate(learnerId: string): Promise<SuccessResponse>;
}
