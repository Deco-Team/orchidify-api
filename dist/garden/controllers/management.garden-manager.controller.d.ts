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
import { IGardenService } from '@garden/services/garden.service';
import { QueryGardenDto } from '@garden/dto/view-garden.dto';
import { CreateGardenDto } from '@garden/dto/create-garden.dto';
import { UpdateGardenDto } from '@garden/dto/update-garden.dto';
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service';
import { IClassService } from '@src/class/services/class.service';
import { QueryAvailableGardenDto } from '@garden/dto/view-available-garden.dto';
export declare class ManagementGardenController {
    private readonly gardenService;
    private readonly gardenManagerService;
    private readonly classService;
    constructor(gardenService: IGardenService, gardenManagerService: IGardenManagerService, classService: IClassService);
    list(req: any, pagination: PaginationParams, queryGardenDto: QueryGardenDto): Promise<any>;
    getDetail(req: any, gardenId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/garden.schema").Garden> & import("../schemas/garden.schema").Garden & Required<{
        _id: string;
    }>>;
    create(createGardenDto: CreateGardenDto): Promise<IDResponse>;
    update(req: any, gardenId: string, updateGardenDto: UpdateGardenDto): Promise<SuccessResponse>;
    deactivate(gardenId: string): Promise<SuccessResponse>;
    activate(gardenId: string): Promise<SuccessResponse>;
    getAvailableGardenList(queryAvailableGardenDto: QueryAvailableGardenDto): Promise<{
        docs: import("@garden/dto/view-available-garden.dto").AvailableGardenListItemResponse[];
    }>;
}
