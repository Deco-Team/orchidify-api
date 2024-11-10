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
exports.ManagementStaffController = void 0;
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
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const view_staff_dto_1 = require("../dto/view-staff.dto");
const user_token_service_1 = require("../../auth/services/user-token.service");
const mongoose_1 = require("mongoose");
const staff_service_1 = require("../services/staff.service");
const create_staff_dto_1 = require("../dto/create-staff.dto");
const update_staff_dto_1 = require("../dto/update-staff.dto");
const recruitment_service_1 = require("../../recruitment/services/recruitment.service");
const constant_2 = require("../contracts/constant");
let ManagementStaffController = class ManagementStaffController {
    constructor(staffService, userTokenService, recruitmentService) {
        this.staffService = staffService;
        this.userTokenService = userTokenService;
        this.recruitmentService = recruitmentService;
    }
    async list(pagination, queryStaffDto) {
        return await this.staffService.list(pagination, queryStaffDto);
    }
    async getDetail(staffId) {
        const staff = await this.staffService.findById(staffId, constant_2.STAFF_DETAIL_PROJECTION);
        if (!staff || staff.role !== constant_1.UserRole.STAFF)
            throw new app_exception_1.AppException(error_1.Errors.STAFF_NOT_FOUND);
        return staff;
    }
    async create(createStaffDto) {
        const existedStaff = await this.staffService.findByEmail(createStaffDto.email);
        if (existedStaff)
            throw new app_exception_1.AppException(error_1.Errors.EMAIL_ALREADY_EXIST);
        const staff = await this.staffService.create(createStaffDto);
        return new dto_1.IDResponse(staff._id);
    }
    async update(staffId, updateStaffDto) {
        const staff = await this.staffService.update({ _id: staffId, role: constant_1.UserRole.STAFF }, updateStaffDto);
        if (!staff)
            throw new app_exception_1.AppException(error_1.Errors.STAFF_NOT_FOUND);
        return new dto_1.SuccessResponse(true);
    }
    async deactivate(staffId) {
        const recruitments = await this.recruitmentService.findByHandledByAndStatus(staffId, [
            constant_1.RecruitmentStatus.INTERVIEWING,
            constant_1.RecruitmentStatus.SELECTED
        ]);
        if (recruitments.length > 0) {
            throw new app_exception_1.AppException(error_1.Errors.STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS);
        }
        await Promise.all([
            this.staffService.update({
                _id: staffId,
                role: constant_1.UserRole.STAFF
            }, { status: constant_1.StaffStatus.INACTIVE }),
            this.userTokenService.clearAllRefreshTokensOfUser(new mongoose_1.Types.ObjectId(staffId), constant_1.UserRole.STAFF)
        ]);
        return new dto_1.SuccessResponse(true);
    }
    async activate(staffId) {
        await this.staffService.update({
            _id: staffId,
            role: constant_1.UserRole.STAFF
        }, { status: constant_1.StaffStatus.ACTIVE });
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementStaffController = ManagementStaffController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Staff List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_staff_dto_1.StaffListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_staff_dto_1.QueryStaffDto]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Staff Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_staff_dto_1.StaffDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.STAFF_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] Add Staff`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.EMAIL_ALREADY_EXIST]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] Update Staff`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.STAFF_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Put)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] Deactivate Staff`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] Activate Staff`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementStaffController.prototype, "activate", null);
exports.ManagementStaffController = ManagementStaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(staff_service_1.IStaffService)),
    __param(1, (0, common_1.Inject)(user_token_service_1.IUserTokenService)),
    __param(2, (0, common_1.Inject)(recruitment_service_1.IRecruitmentService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ManagementStaffController);
//# sourceMappingURL=management.staff.controller.js.map