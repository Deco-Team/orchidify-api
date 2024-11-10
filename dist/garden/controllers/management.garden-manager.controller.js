"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementGardenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const garden_service_1 = require("../services/garden.service");
const view_garden_dto_1 = require("../dto/view-garden.dto");
const constant_2 = require("../contracts/constant");
const create_garden_dto_1 = require("../dto/create-garden.dto");
const update_garden_dto_1 = require("../dto/update-garden.dto");
const garden_manager_service_1 = require("../../garden-manager/services/garden-manager.service");
const class_service_1 = require("../../class/services/class.service");
const mongoose_1 = require("mongoose");
const view_available_garden_dto_1 = require("../dto/view-available-garden.dto");
let ManagementGardenController = class ManagementGardenController {
    constructor(gardenService, gardenManagerService, classService) {
        this.gardenService = gardenService;
        this.gardenManagerService = gardenManagerService;
        this.classService = classService;
    }
    async list(req, pagination, queryGardenDto) {
        const { _id, role } = _.get(req, 'user');
        if (role === constant_1.UserRole.GARDEN_MANAGER) {
            queryGardenDto.gardenManagerId = new mongoose_1.Types.ObjectId(_id);
        }
        return await this.gardenService.list(pagination, queryGardenDto, constant_2.GARDEN_LIST_PROJECTION, [
            {
                path: 'gardenManager',
                select: ['name']
            }
        ]);
    }
    async getDetail(req, gardenId) {
        const { _id, role } = _.get(req, 'user');
        const garden = await this.gardenService.findById(gardenId, constant_2.GARDEN_DETAIL_PROJECTION, [
            {
                path: 'gardenManager',
                select: ['name']
            }
        ]);
        if (!garden || (role === constant_1.UserRole.GARDEN_MANAGER && garden?.gardenManagerId?.toString() !== _id))
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_FOUND);
        return garden;
    }
    async create(createGardenDto) {
        const gardenManager = await this.gardenManagerService.findById(createGardenDto.gardenManagerId);
        if (!gardenManager || gardenManager.status !== constant_1.GardenManagerStatus.ACTIVE)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_MANAGER_NOT_FOUND);
        const garden = await this.gardenService.create(createGardenDto);
        return new dto_1.IDResponse(garden._id);
    }
    async update(req, gardenId, updateGardenDto) {
        const { _id, role } = _.get(req, 'user');
        const conditions = { _id: gardenId };
        if (role === constant_1.UserRole.GARDEN_MANAGER) {
            delete updateGardenDto.gardenManagerId;
            conditions['gardenManagerId'] = new mongoose_1.Types.ObjectId(_id);
        }
        if (updateGardenDto.gardenManagerId) {
            const gardenManager = await this.gardenManagerService.findById(updateGardenDto.gardenManagerId);
            if (!gardenManager || gardenManager.status !== constant_1.GardenManagerStatus.ACTIVE)
                throw new app_exception_1.AppException(error_1.Errors.GARDEN_MANAGER_NOT_FOUND);
        }
        const garden = await this.gardenService.update(conditions, updateGardenDto);
        if (!garden)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_FOUND);
        return new dto_1.SuccessResponse(true);
    }
    async deactivate(gardenId) {
        const courseClasses = await this.classService.findManyByGardenIdAndStatus(gardenId, [
            constant_1.ClassStatus.PUBLISHED,
            constant_1.ClassStatus.IN_PROGRESS
        ]);
        if (courseClasses.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN);
        await this.gardenService.update({
            _id: gardenId
        }, { status: constant_1.GardenStatus.INACTIVE });
        return new dto_1.SuccessResponse(true);
    }
    async activate(gardenId) {
        await this.gardenService.update({
            _id: gardenId
        }, { status: constant_1.GardenStatus.ACTIVE });
        return new dto_1.SuccessResponse(true);
    }
    async getAvailableGardenList(queryAvailableGardenDto) {
        const docs = await this.gardenService.getAvailableGardenList(queryAvailableGardenDto);
        return { docs };
    }
};
exports.ManagementGardenController = ManagementGardenController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}][${constant_1.UserRole.GARDEN_MANAGER}] View Garden List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_dto_1.GardenListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_garden_dto_1.QueryGardenDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}][${constant_1.UserRole.GARDEN_MANAGER}] View Garden Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_dto_1.GardenDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Add Garden`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_NAME_EXISTED, error_1.Errors.GARDEN_MANAGER_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_garden_dto_1.CreateGardenDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}][${constant_1.UserRole.GARDEN_MANAGER}] Update Garden`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_NOT_FOUND, error_1.Errors.GARDEN_NAME_EXISTED, error_1.Errors.GARDEN_MANAGER_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER),
    (0, common_1.Put)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_garden_dto_1.UpdateGardenDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Deactivate Garden`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Activate Garden`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "activate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Available Garden List for Create Request to Publish Class`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_available_garden_dto_1.AvailableGardenListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_available_garden_dto_1.QueryAvailableGardenDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenController.prototype, "getAvailableGardenList", null);
exports.ManagementGardenController = ManagementGardenController = __decorate([
    (0, swagger_1.ApiTags)('Garden - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(garden_service_1.IGardenService)),
    __param(1, (0, common_1.Inject)(garden_manager_service_1.IGardenManagerService)),
    __param(2, (0, common_1.Inject)(class_service_1.IClassService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ManagementGardenController);
//# sourceMappingURL=management.garden-manager.controller.js.map