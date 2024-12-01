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
exports.ManagementLearnerController = void 0;
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
const user_token_service_1 = require("../../auth/services/user-token.service");
const mongoose_1 = require("mongoose");
const learner_service_1 = require("../services/learner.service");
const view_learner_dto_1 = require("../dto/view-learner.dto");
const constant_2 = require("../contracts/constant");
const report_service_1 = require("../../report/services/report.service");
const constant_3 = require("../../report/contracts/constant");
let ManagementLearnerController = class ManagementLearnerController {
    constructor(learnerService, userTokenService, reportService) {
        this.learnerService = learnerService;
        this.userTokenService = userTokenService;
        this.reportService = reportService;
    }
    async list(pagination, queryLearnerDto) {
        return await this.learnerService.list(pagination, queryLearnerDto);
    }
    async getDetail(learnerId) {
        const learner = await this.learnerService.findById(learnerId, constant_2.LEARNER_DETAIL_PROJECTION);
        if (!learner)
            throw new app_exception_1.AppException(error_1.Errors.LEARNER_NOT_FOUND);
        return learner;
    }
    async deactivate(learnerId) {
        await Promise.all([
            this.learnerService.update({
                _id: learnerId
            }, { status: constant_1.LearnerStatus.INACTIVE }),
            this.userTokenService.clearAllRefreshTokensOfUser(new mongoose_1.Types.ObjectId(learnerId), constant_1.UserRole.LEARNER),
            this.reportService.update({ type: constant_3.ReportType.LearnerSum, tag: constant_3.ReportTag.System }, {
                $inc: {
                    [`data.${constant_1.LearnerStatus.ACTIVE}.quantity`]: -1,
                    [`data.${constant_1.LearnerStatus.INACTIVE}.quantity`]: 1
                }
            })
        ]);
        return new dto_1.SuccessResponse(true);
    }
    async activate(learnerId) {
        await this.learnerService.update({
            _id: learnerId
        }, { status: constant_1.LearnerStatus.ACTIVE });
        this.reportService.update({ type: constant_3.ReportType.LearnerSum, tag: constant_3.ReportTag.System }, {
            $inc: {
                [`data.${constant_1.LearnerStatus.ACTIVE}.quantity`]: 1,
                [`data.${constant_1.LearnerStatus.INACTIVE}.quantity`]: -1
            }
        });
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementLearnerController = ManagementLearnerController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Learner List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_learner_dto_1.LearnerListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_learner_dto_1.QueryLearnerDto]),
    __metadata("design:returntype", Promise)
], ManagementLearnerController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Learner Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_learner_dto_1.LearnerDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.LEARNER_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementLearnerController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Deactivate Learner`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementLearnerController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Activate Learner`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementLearnerController.prototype, "activate", null);
exports.ManagementLearnerController = ManagementLearnerController = __decorate([
    (0, swagger_1.ApiTags)('Learner - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(learner_service_1.ILearnerService)),
    __param(1, (0, common_1.Inject)(user_token_service_1.IUserTokenService)),
    __param(2, (0, common_1.Inject)(report_service_1.IReportService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ManagementLearnerController);
//# sourceMappingURL=management.learner.controller.js.map