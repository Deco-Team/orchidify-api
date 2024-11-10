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
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service';
import { PaginationParams } from '@common/decorators/pagination.decorator';
import { CreateGardenManagerDto } from '@garden-manager/dto/create-garden-manager.dto';
import { UpdateGardenManagerDto } from '@garden-manager/dto/update-garden-manager.dto';
import { QueryGardenManagerDto } from '@garden-manager/dto/view-garden-manager.dto';
import { IUserTokenService } from '@auth/services/user-token.service';
import { IGardenService } from '@garden/services/garden.service';
export declare class ManagementGardenManagerController {
    private readonly gardenManagerService;
    private readonly userTokenService;
    private readonly gardenService;
    constructor(gardenManagerService: IGardenManagerService, userTokenService: IUserTokenService, gardenService: IGardenService);
    list(pagination: PaginationParams, queryGardenManagerDto: QueryGardenManagerDto): Promise<any>;
    getDetail(gardenManagerId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/garden-manager.schema").GardenManager> & import("../schemas/garden-manager.schema").GardenManager & Required<{
        _id: string;
    }>>;
    create(createGardenManagerDto: CreateGardenManagerDto): Promise<IDResponse>;
    update(gardenManagerId: string, updateGardenManagerDto: UpdateGardenManagerDto): Promise<SuccessResponse>;
    deactivate(gardenManagerId: string): Promise<SuccessResponse>;
    activate(gardenManagerId: string): Promise<SuccessResponse>;
}
