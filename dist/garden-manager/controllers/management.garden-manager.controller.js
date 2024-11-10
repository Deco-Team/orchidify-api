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
exports.ManagementGardenManagerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const garden_manager_service_1 = require("../services/garden-manager.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const create_garden_manager_dto_1 = require("../dto/create-garden-manager.dto");
const update_garden_manager_dto_1 = require("../dto/update-garden-manager.dto");
const view_garden_manager_dto_1 = require("../dto/view-garden-manager.dto");
const constant_2 = require("../contracts/constant");
const user_token_service_1 = require("../../auth/services/user-token.service");
const garden_service_1 = require("../../garden/services/garden.service");
const mongoose_1 = require("mongoose");
let ManagementGardenManagerController = class ManagementGardenManagerController {
    constructor(gardenManagerService, userTokenService, gardenService) {
        this.gardenManagerService = gardenManagerService;
        this.userTokenService = userTokenService;
        this.gardenService = gardenService;
    }
    async list(pagination, queryGardenManagerDto) {
        return await this.gardenManagerService.list(pagination, queryGardenManagerDto);
    }
    async getDetail(gardenManagerId) {
        const gardenManager = await this.gardenManagerService.findById(gardenManagerId, constant_2.GARDEN_MANAGER_DETAIL_PROJECTION, [
            {
                path: 'gardens',
                perDocumentLimit: 10,
                select: ['name', '-gardenManagerId']
            }
        ]);
        if (!gardenManager)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_MANAGER_NOT_FOUND);
        return gardenManager;
    }
    async create(createGardenManagerDto) {
        const existedGardenManager = await this.gardenManagerService.findByEmail(createGardenManagerDto.email);
        if (existedGardenManager)
            throw new app_exception_1.AppException(error_1.Errors.EMAIL_ALREADY_EXIST);
        const gardenManager = await this.gardenManagerService.create(createGardenManagerDto);
        return new dto_1.IDResponse(gardenManager._id);
    }
    async update(gardenManagerId, updateGardenManagerDto) {
        const gardenManager = await this.gardenManagerService.update({ _id: gardenManagerId }, updateGardenManagerDto);
        if (!gardenManager)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_MANAGER_NOT_FOUND);
        return new dto_1.SuccessResponse(true);
    }
    async deactivate(gardenManagerId) {
        const gardens = await this.gardenService.findManyByGardenManagerId(gardenManagerId);
        if (gardens.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN);
        await Promise.all([
            this.gardenManagerService.update({
                _id: gardenManagerId
            }, { status: constant_1.GardenManagerStatus.INACTIVE }),
            this.userTokenService.clearAllRefreshTokensOfUser(new mongoose_1.Types.ObjectId(gardenManagerId), constant_1.UserRole.GARDEN_MANAGER)
        ]);
        return new dto_1.SuccessResponse(true);
    }
    async activate(gardenManagerId) {
        await this.gardenManagerService.update({
            _id: gardenManagerId
        }, { status: constant_1.GardenManagerStatus.ACTIVE });
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementGardenManagerController = ManagementGardenManagerController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Garden Manager List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_manager_dto_1.GardenManagerListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_garden_manager_dto_1.QueryGardenManagerDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Garden Manager Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_manager_dto_1.GardenManagerDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_MANAGER_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Add Garden Manager`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.EMAIL_ALREADY_EXIST]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_garden_manager_dto_1.CreateGardenManagerDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Update Garden Manager`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_MANAGER_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Put)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_garden_manager_dto_1.UpdateGardenManagerDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Deactivate Garden Manager`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Activate Garden Manager`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementGardenManagerController.prototype, "activate", null);
exports.ManagementGardenManagerController = ManagementGardenManagerController = __decorate([
    (0, swagger_1.ApiTags)('Garden Manager'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(garden_manager_service_1.IGardenManagerService)),
    __param(1, (0, common_1.Inject)(user_token_service_1.IUserTokenService)),
    __param(2, (0, common_1.Inject)(garden_service_1.IGardenService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ManagementGardenManagerController);
//# sourceMappingURL=management.garden-manager.controller.js.map