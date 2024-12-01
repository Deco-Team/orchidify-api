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
exports.ManagementPayoutRequestController = void 0;
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
const payout_request_service_1 = require("../services/payout-request.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const view_payout_request_dto_1 = require("../dto/view-payout-request.dto");
const constant_2 = require("../contracts/constant");
const reject_payout_request_dto_1 = require("../dto/reject-payout-request.dto");
const mark_has_made_payout_dto_1 = require("../dto/mark-has-made-payout.dto");
let ManagementPayoutRequestController = class ManagementPayoutRequestController {
    constructor(payoutRequestService) {
        this.payoutRequestService = payoutRequestService;
    }
    async list(pagination, queryPayoutRequestDto) {
        return await this.payoutRequestService.list(pagination, queryPayoutRequestDto, constant_2.PAYOUT_REQUEST_LIST_PROJECTION, [
            {
                path: 'createdBy',
                select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar', 'paymentInfo']
            }
        ]);
    }
    async getDetail(payoutRequestId) {
        const payoutRequest = await this.payoutRequestService.findById(payoutRequestId, constant_2.PAYOUT_REQUEST_DETAIL_PROJECTION, [
            {
                path: 'createdBy',
                select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar', 'paymentInfo']
            }
        ]);
        if (!payoutRequest)
            throw new app_exception_1.AppException(error_1.Errors.PAYOUT_REQUEST_NOT_FOUND);
        return payoutRequest;
    }
    async approve(req, payoutRequestId) {
        const user = _.get(req, 'user');
        return this.payoutRequestService.approvePayoutRequest(payoutRequestId, user);
    }
    async reject(req, payoutRequestId, rejectPayoutRequestDto) {
        const user = _.get(req, 'user');
        return this.payoutRequestService.rejectPayoutRequest(payoutRequestId, rejectPayoutRequestDto, user);
    }
    async markAsHasMadePayout(req, payoutRequestId, markHasMadePayoutDto) {
        const user = _.get(req, 'user');
        return this.payoutRequestService.markHasMadePayout(payoutRequestId, markHasMadePayoutDto, user);
    }
};
exports.ManagementPayoutRequestController = ManagementPayoutRequestController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Payout Request List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_payout_request_dto_1.StaffViewPayoutRequestListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_payout_request_dto_1.QueryPayoutRequestDto]),
    __metadata("design:returntype", Promise)
], ManagementPayoutRequestController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Payout Request Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_payout_request_dto_1.StaffViewPayoutRequestDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.PAYOUT_REQUEST_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementPayoutRequestController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Approve Payout Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.PAYOUT_REQUEST_NOT_FOUND,
        error_1.Errors.PAYOUT_REQUEST_STATUS_INVALID,
        error_1.Errors.PAYOUT_AMOUNT_LIMIT_PER_DAY
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ManagementPayoutRequestController.prototype, "approve", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Reject Payout Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.PAYOUT_REQUEST_NOT_FOUND, error_1.Errors.PAYOUT_REQUEST_STATUS_INVALID]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reject_payout_request_dto_1.RejectPayoutRequestDto]),
    __metadata("design:returntype", Promise)
], ManagementPayoutRequestController.prototype, "reject", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Mask Payout Request as Has made payout`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.PAYOUT_REQUEST_NOT_FOUND,
        error_1.Errors.PAYOUT_REQUEST_STATUS_INVALID,
        error_1.Errors.REQUEST_ALREADY_HAS_MADE_PAYOUT
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/make-payout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, mark_has_made_payout_dto_1.MarkHasMadePayoutDto]),
    __metadata("design:returntype", Promise)
], ManagementPayoutRequestController.prototype, "markAsHasMadePayout", null);
exports.ManagementPayoutRequestController = ManagementPayoutRequestController = __decorate([
    (0, swagger_1.ApiTags)('PayoutRequest - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(payout_request_service_1.IPayoutRequestService)),
    __metadata("design:paramtypes", [Object])
], ManagementPayoutRequestController);
//# sourceMappingURL=management.payout-request.controller.js.map