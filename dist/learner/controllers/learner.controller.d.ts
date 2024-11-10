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
import { ILearnerService } from '@src/learner/services/learner.service';
import { SuccessResponse } from '@common/contracts/dto';
import { UpdateLearnerProfileDto } from '@learner/dto/update-learner-profile.dto';
export declare class LearnerController {
    private readonly learnerService;
    constructor(learnerService: ILearnerService);
    viewProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/learner.schema").Learner> & import("../schemas/learner.schema").Learner & Required<{
        _id: string;
    }>>;
    updateProfile(req: any, updateLearnerProfileDto: UpdateLearnerProfileDto): Promise<SuccessResponse>;
}
