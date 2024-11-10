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
var TransactionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const constant_1 = require("../contracts/constant");
const transaction_service_1 = require("../services/transaction.service");
const dto_1 = require("../../common/contracts/dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const view_transaction_dto_1 = require("../dto/view-transaction.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_2 = require("../../common/contracts/constant");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const app_exception_1 = require("../../common/exceptions/app.exception");
let TransactionController = TransactionController_1 = class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.logger = new common_1.Logger(TransactionController_1.name);
    }
    async list(pagination, queryTransactionDto) {
        return await this.transactionService.list(pagination, queryTransactionDto);
    }
    async getDetail(staffId) {
        const transaction = await this.transactionService.findById(staffId, [...constant_1.TRANSACTION_DETAIL_PROJECTION]);
        if (!transaction)
            throw new app_exception_1.AppException(error_1.Errors.TRANSACTION_NOT_FOUND);
        const payment = _.pick(transaction.payment, ['id', 'code', 'createdAt', 'status', 'description', 'orderInfo']);
        const payout = _.pick(transaction.payout, ['id', 'code', 'createdAt', 'status']);
        return { ...transaction.toObject(), payment, payout };
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_2.UserRole.ADMIN}] View Transaction List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_transaction_dto_1.TransactionListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_2.UserRole.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_transaction_dto_1.QueryTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_2.UserRole.ADMIN}] View Transaction Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_transaction_dto_1.TransactionDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.TRANSACTION_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_2.UserRole.ADMIN),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getDetail", null);
exports.TransactionController = TransactionController = TransactionController_1 = __decorate([
    (0, swagger_1.ApiTags)('Transaction'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(transaction_service_1.ITransactionService)),
    __metadata("design:paramtypes", [Object])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map