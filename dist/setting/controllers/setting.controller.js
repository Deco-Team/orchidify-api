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
exports.SettingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/contracts/dto");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const setting_service_1 = require("../services/setting.service");
const view_setting_dto_1 = require("../dto/view-setting.dto");
const constant_1 = require("../contracts/constant");
const app_exception_1 = require("../../common/exceptions/app.exception");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let SettingController = class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async getByKey(querySettingDto) {
        return await this.settingService.findByKey(querySettingDto.key);
    }
    async getCourseTypesSetting() {
        const setting = await this.settingService.findByKey(constant_1.SettingKey.CourseTypes);
        if (!setting || setting.enabled === false)
            throw new app_exception_1.AppException(error_1.Errors.SETTING_NOT_FOUND);
        return { docs: setting.value };
    }
};
exports.SettingController = SettingController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Setting Value By Key`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: view_setting_dto_1.SettingDetailDataResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_setting_dto_1.QuerySettingDto]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getByKey", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Course Types (Setting Detail)`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_setting_dto_1.CourseTypesSettingDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SETTING_NOT_FOUND]),
    (0, common_1.Get)('course-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getCourseTypesSetting", null);
exports.SettingController = SettingController = __decorate([
    (0, swagger_1.ApiTags)('Setting'),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object])
], SettingController);
//# sourceMappingURL=setting.controller.js.map