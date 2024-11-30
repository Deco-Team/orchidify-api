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
import { QueryStaffDto } from '@staff/dto/view-staff.dto';
import { IUserTokenService } from '@auth/services/user-token.service';
import { IStaffService } from '@staff/services/staff.service';
import { CreateStaffDto } from '@staff/dto/create-staff.dto';
import { UpdateStaffDto } from '@staff/dto/update-staff.dto';
import { IRecruitmentService } from '@recruitment/services/recruitment.service';
import { IReportService } from '@report/services/report.service';
export declare class ManagementStaffController {
    private readonly staffService;
    private readonly userTokenService;
    private readonly recruitmentService;
    private readonly reportService;
    constructor(staffService: IStaffService, userTokenService: IUserTokenService, recruitmentService: IRecruitmentService, reportService: IReportService);
    list(pagination: PaginationParams, queryStaffDto: QueryStaffDto): Promise<any>;
    getDetail(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/staff.schema").Staff> & import("../schemas/staff.schema").Staff & Required<{
        _id: string;
    }>>;
    create(createStaffDto: CreateStaffDto): Promise<IDResponse>;
    update(staffId: string, updateStaffDto: UpdateStaffDto): Promise<SuccessResponse>;
    deactivate(staffId: string): Promise<SuccessResponse>;
    activate(staffId: string): Promise<SuccessResponse>;
}
