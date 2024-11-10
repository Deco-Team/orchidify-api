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
exports.InstructorPayoutRequestController = void 0;
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
const create_payout_request_dto_1 = require("../dto/create-payout-request.dto");
const view_payout_request_dto_1 = require("../dto/view-payout-request.dto");
const constant_2 = require("../contracts/constant");
const mongoose_1 = require("mongoose");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_3 = require("../../setting/contracts/constant");
let InstructorPayoutRequestController = class InstructorPayoutRequestController {
    constructor(payoutRequestService, settingService) {
        this.payoutRequestService = payoutRequestService;
        this.settingService = settingService;
    }
    async list(req, pagination, queryPayoutRequestDto) {
        const { _id } = _.get(req, 'user');
        queryPayoutRequestDto.createdBy = _id;
        return await this.payoutRequestService.list(pagination, queryPayoutRequestDto);
    }
    async getDetail(req, payoutRequestId) {
        const { _id } = _.get(req, 'user');
        const payoutRequest = await this.payoutRequestService.findById(payoutRequestId, constant_2.PAYOUT_REQUEST_DETAIL_PROJECTION);
        if (!payoutRequest || payoutRequest.createdBy?.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.PAYOUT_REQUEST_NOT_FOUND);
        return payoutRequest;
    }
    async createPayoutRequest(req, createPayoutRequestDto) {
        const { _id, role } = _.get(req, 'user');
        const createPayoutRequestLimit = Number((await this.settingService.findByKey(constant_3.SettingKey.CreatePayoutRequestLimitPerDay)).value) || 5;
        const payoutRequestsCount = await this.payoutRequestService.countByCreatedByAndDate(_id, new Date());
        if (payoutRequestsCount > createPayoutRequestLimit)
            throw new app_exception_1.AppException(error_1.Errors.CREATE_PAYOUT_REQUEST_LIMIT);
        createPayoutRequestDto['status'] = constant_1.PayoutRequestStatus.PENDING;
        createPayoutRequestDto['histories'] = [
            {
                status: constant_1.PayoutRequestStatus.PENDING,
                timestamp: new Date(),
                userId: new mongoose_1.Types.ObjectId(_id),
                userRole: role
            }
        ];
        createPayoutRequestDto['createdBy'] = new mongoose_1.Types.ObjectId(_id);
        const payoutRequest = await this.payoutRequestService.createPayoutRequest(createPayoutRequestDto);
        return new dto_1.IDResponse(payoutRequest._id);
    }
    async cancel(req, payoutRequestId) {
        const user = _.get(req, 'user');
        return this.payoutRequestService.cancelPayoutRequest(payoutRequestId, user);
    }
};
exports.InstructorPayoutRequestController = InstructorPayoutRequestController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Payout Request List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_payout_request_dto_1.InstructorViewPayoutRequestListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_payout_request_dto_1.QueryPayoutRequestDto]),
    __metadata("design:returntype", Promise)
], InstructorPayoutRequestController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Payout Request Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_payout_request_dto_1.InstructorViewPayoutRequestDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.PAYOUT_REQUEST_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorPayoutRequestController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create Payout Request`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CREATE_PAYOUT_REQUEST_LIMIT, error_1.Errors.NOT_ENOUGH_BALANCE_TO_CREATE_PAYOUT_REQUEST]),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payout_request_dto_1.CreatePayoutRequestDto]),
    __metadata("design:returntype", Promise)
], InstructorPayoutRequestController.prototype, "createPayoutRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Cancel Payout Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.PAYOUT_REQUEST_NOT_FOUND, error_1.Errors.PAYOUT_REQUEST_STATUS_INVALID]),
    (0, common_1.Patch)(':id([0-9a-f]{24})/cancel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorPayoutRequestController.prototype, "cancel", null);
exports.InstructorPayoutRequestController = InstructorPayoutRequestController = __decorate([
    (0, swagger_1.ApiTags)('PayoutRequest - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(payout_request_service_1.IPayoutRequestService)),
    __param(1, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object, Object])
], InstructorPayoutRequestController);
//# sourceMappingURL=instructor.payout-request.controller.js.map