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
exports.LearnerGardenController = void 0;
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
const garden_service_1 = require("../services/garden.service");
const view_garden_dto_1 = require("../dto/view-garden.dto");
const constant_2 = require("../contracts/constant");
let LearnerGardenController = class LearnerGardenController {
    constructor(gardenService) {
        this.gardenService = gardenService;
    }
    async getDetail(gardenId) {
        const garden = await this.gardenService.findById(gardenId, constant_2.GARDEN_DETAIL_PROJECTION);
        if (!garden)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_FOUND);
        return garden;
    }
};
exports.LearnerGardenController = LearnerGardenController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Garden Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_dto_1.GardenDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LearnerGardenController.prototype, "getDetail", null);
exports.LearnerGardenController = LearnerGardenController = __decorate([
    (0, swagger_1.ApiTags)('Garden - Learner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Controller)('learner'),
    __param(0, (0, common_1.Inject)(garden_service_1.IGardenService)),
    __metadata("design:paramtypes", [Object])
], LearnerGardenController);
//# sourceMappingURL=learner.garden-manager.controller.js.map