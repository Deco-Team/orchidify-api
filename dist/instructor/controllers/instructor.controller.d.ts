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
import { IInstructorService } from '@instructor/services/instructor.service';
import { UpdateInstructorProfileDto } from '@instructor/dto/update-instructor-profile.dto';
export declare class InstructorController {
    private readonly instructorService;
    constructor(instructorService: IInstructorService);
    viewProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & Required<{
        _id: string;
    }>>;
    viewCertifications(req: any): Promise<{
        docs: any[] | import("../dto/base.instructor.dto").InstructorCertificateDto[];
    }>;
    updateProfile(req: any, updateInstructorProfileDto: UpdateInstructorProfileDto): Promise<SuccessResponse>;
}
