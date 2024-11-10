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
exports.ManagementRecruitmentController = void 0;
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
const recruitment_service_1 = require("../services/recruitment.service");
const view_recruitment_dto_1 = require("../dto/view-recruitment.dto");
const constant_2 = require("../contracts/constant");
const process_recruitment_application_dto_1 = require("../dto/process-recruitment-application.dto");
const reject_recruitment_process_dto_1 = require("../dto/reject-recruitment-process.dto");
let ManagementRecruitmentController = class ManagementRecruitmentController {
    constructor(recruitmentService) {
        this.recruitmentService = recruitmentService;
    }
    async list(pagination, queryRecruitmentDto) {
        return await this.recruitmentService.list(pagination, queryRecruitmentDto);
    }
    async getDetail(recruitmentId) {
        const recruitment = await this.recruitmentService.findById(recruitmentId, constant_2.RECRUITMENT_DETAIL_PROJECTION);
        if (!recruitment)
            throw new app_exception_1.AppException(error_1.Errors.RECRUITMENT_NOT_FOUND);
        return recruitment;
    }
    async processApplication(req, recruitmentId, processRecruitmentApplicationDto) {
        const user = _.get(req, 'user');
        return this.recruitmentService.processRecruitmentApplication(recruitmentId, processRecruitmentApplicationDto, user);
    }
    async processInterview(req, recruitmentId) {
        const user = _.get(req, 'user');
        return this.recruitmentService.processRecruitmentInterview(recruitmentId, user);
    }
    async reject(req, recruitmentId, rejectRecruitmentProcessDto) {
        const user = _.get(req, 'user');
        return this.recruitmentService.rejectRecruitmentProcess(recruitmentId, rejectRecruitmentProcessDto, user);
    }
};
exports.ManagementRecruitmentController = ManagementRecruitmentController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Recruitment List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_recruitment_dto_1.RecruitmentListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_recruitment_dto_1.QueryRecruitmentDto]),
    __metadata("design:returntype", Promise)
], ManagementRecruitmentController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Recruitment Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_recruitment_dto_1.RecruitmentDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.RECRUITMENT_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementRecruitmentController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Process Recruitment Application (change status to ${constant_1.RecruitmentStatus.INTERVIEWING})`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.RECRUITMENT_NOT_FOUND, error_1.Errors.RECRUITMENT_STATUS_INVALID]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/process-application'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, process_recruitment_application_dto_1.ProcessRecruitmentApplicationDto]),
    __metadata("design:returntype", Promise)
], ManagementRecruitmentController.prototype, "processApplication", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Process Recruitment Interview (change status to ${constant_1.RecruitmentStatus.SELECTED})`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.RECRUITMENT_NOT_FOUND,
        error_1.Errors.RECRUITMENT_STATUS_INVALID,
        error_1.Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/process-interview'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ManagementRecruitmentController.prototype, "processInterview", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Reject Recruitment Process`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_REQUEST_NOT_FOUND,
        error_1.Errors.CLASS_REQUEST_STATUS_INVALID,
        error_1.Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/reject-process'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reject_recruitment_process_dto_1.RejectRecruitmentProcessDto]),
    __metadata("design:returntype", Promise)
], ManagementRecruitmentController.prototype, "reject", null);
exports.ManagementRecruitmentController = ManagementRecruitmentController = __decorate([
    (0, swagger_1.ApiTags)('Recruitment - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(recruitment_service_1.IRecruitmentService)),
    __metadata("design:paramtypes", [Object])
], ManagementRecruitmentController);
//# sourceMappingURL=management.recruitment.controller.js.map