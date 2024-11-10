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
import { IClassRequestService } from '@class-request/services/class-request.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreatePublishClassRequestDto } from '@class-request/dto/create-publish-class-request.dto';
import { QueryClassRequestDto } from '@class-request/dto/view-class-request.dto';
import { ICourseService } from '@course/services/course.service';
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service';
import { HelperService } from '@common/services/helper.service';
import { ISettingService } from '@setting/services/setting.service';
export declare class InstructorClassRequestController {
    private readonly classRequestService;
    private readonly courseService;
    private readonly gardenTimesheetService;
    private readonly settingService;
    private readonly helperService;
    constructor(classRequestService: IClassRequestService, courseService: ICourseService, gardenTimesheetService: IGardenTimesheetService, settingService: ISettingService, helperService: HelperService);
    list(req: any, pagination: PaginationParams, queryClassRequestDto: QueryClassRequestDto): Promise<any>;
    getDetail(req: any, classRequestId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/class-request.schema").ClassRequest> & import("../schemas/class-request.schema").ClassRequest & Required<{
        _id: string;
    }>>;
    createPublishClassRequest(req: any, createPublishClassRequestDto: CreatePublishClassRequestDto): Promise<IDResponse>;
    cancel(req: any, classRequestId: string): Promise<import("@common/contracts/dto").SuccessResponse>;
}
