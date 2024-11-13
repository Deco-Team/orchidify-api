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
import { ICertificateService } from '@certificate/services/certificate.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { QueryCertificateDto } from '@certificate/dto/view-certificate.dto';
export declare class LearnerCertificateController {
    private readonly certificateService;
    constructor(certificateService: ICertificateService);
    list(req: any, pagination: PaginationParams, queryStaffDto: QueryCertificateDto): Promise<any>;
    getDetail(req: any, certificateId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/certificate.schema").Certificate> & import("../schemas/certificate.schema").Certificate & Required<{
        _id: string;
    }>>;
}
