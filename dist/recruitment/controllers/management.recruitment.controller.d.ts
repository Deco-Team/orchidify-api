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
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { IRecruitmentService } from '@recruitment/services/recruitment.service';
import { QueryRecruitmentDto } from '@recruitment/dto/view-recruitment.dto';
import { ProcessRecruitmentApplicationDto } from '@recruitment/dto/process-recruitment-application.dto';
import { RejectRecruitmentProcessDto } from '@recruitment/dto/reject-recruitment-process.dto';
export declare class ManagementRecruitmentController {
    private readonly recruitmentService;
    constructor(recruitmentService: IRecruitmentService);
    list(pagination: PaginationParams, queryRecruitmentDto: QueryRecruitmentDto): Promise<any>;
    getDetail(recruitmentId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/recruitment.schema").Recruitment> & import("../schemas/recruitment.schema").Recruitment & Required<{
        _id: string;
    }>>;
    processApplication(req: any, recruitmentId: string, processRecruitmentApplicationDto: ProcessRecruitmentApplicationDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    processInterview(req: any, recruitmentId: string): Promise<import("@common/contracts/dto").SuccessResponse>;
    reject(req: any, recruitmentId: string, rejectRecruitmentProcessDto: RejectRecruitmentProcessDto): Promise<import("@common/contracts/dto").SuccessResponse>;
}
