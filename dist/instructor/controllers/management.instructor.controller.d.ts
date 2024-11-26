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
import { IDResponse, SuccessResponse } from '@common/contracts/dto';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { IUserTokenService } from '@auth/services/user-token.service';
import { IInstructorService } from '@instructor/services/instructor.service';
import { QueryInstructorDto } from '@instructor/dto/view-instructor.dto';
import { UpdateInstructorDto } from '@instructor/dto/update-instructor.dto';
import { IClassService } from '@src/class/services/class.service';
import { CreateInstructorDto } from '@instructor/dto/create-instructor.dto';
import { IRecruitmentService } from '@recruitment/services/recruitment.service';
import { IReportService } from '@report/services/report.service';
export declare class ManagementInstructorController {
    private readonly instructorService;
    private readonly userTokenService;
    private readonly classService;
    private readonly recruitmentService;
    private readonly reportService;
    constructor(instructorService: IInstructorService, userTokenService: IUserTokenService, classService: IClassService, recruitmentService: IRecruitmentService, reportService: IReportService);
    list(pagination: PaginationParams, queryInstructorDto: QueryInstructorDto): Promise<any>;
    getDetail(instructorId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & Required<{
        _id: string;
    }>>;
    create(createInstructorDto: CreateInstructorDto): Promise<IDResponse>;
    update(instructorId: string, updateInstructorDto: UpdateInstructorDto): Promise<SuccessResponse>;
    deactivate(instructorId: string): Promise<SuccessResponse>;
    activate(instructorId: string): Promise<SuccessResponse>;
}
