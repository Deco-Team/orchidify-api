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
exports.ManagementClassRequestController = void 0;
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
const class_request_service_1 = require("../services/class-request.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const view_class_request_dto_1 = require("../dto/view-class-request.dto");
const constant_2 = require("../contracts/constant");
const reject_class_request_dto_1 = require("../dto/reject-class-request.dto");
const approve_class_request_dto_1 = require("../dto/approve-class-request.dto");
let ManagementClassRequestController = class ManagementClassRequestController {
    constructor(classRequestService) {
        this.classRequestService = classRequestService;
    }
    async list(pagination, queryClassRequestDto) {
        return await this.classRequestService.list(pagination, queryClassRequestDto, constant_2.CLASS_REQUEST_LIST_PROJECTION, [
            {
                path: 'createdBy',
                select: ['_id', 'name', 'email', 'idCardPhoto', 'avatar']
            }
        ]);
    }
    async getDetail(classRequestId) {
        const classRequest = await this.classRequestService.findById(classRequestId, constant_2.CLASS_REQUEST_DETAIL_PROJECTION, [
            {
                path: 'createdBy',
                select: ['_id', 'name', 'phone', 'email', 'idCardPhoto', 'avatar']
            },
            {
                path: 'class',
                select: ['+sessions'],
                populate: [
                    {
                        path: 'course',
                        select: ['code']
                    }
                ]
            }
        ]);
        if (!classRequest)
            throw new app_exception_1.AppException(error_1.Errors.CLASS_REQUEST_NOT_FOUND);
        return classRequest;
    }
    async approve(req, classRequestId, approveClassRequestDto) {
        const user = _.get(req, 'user');
        return this.classRequestService.approveClassRequest(classRequestId, approveClassRequestDto, user);
    }
    async reject(req, classRequestId, RejectClassRequestDto) {
        const user = _.get(req, 'user');
        return this.classRequestService.rejectClassRequest(classRequestId, RejectClassRequestDto, user);
    }
};
exports.ManagementClassRequestController = ManagementClassRequestController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Class Request List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_request_dto_1.StaffViewClassRequestListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_class_request_dto_1.QueryClassRequestDto]),
    __metadata("design:returntype", Promise)
], ManagementClassRequestController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Class Request Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_class_request_dto_1.StaffViewClassRequestDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CLASS_REQUEST_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementClassRequestController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Approve Publish/Cancel Class Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_REQUEST_NOT_FOUND,
        error_1.Errors.CLASS_REQUEST_STATUS_INVALID,
        error_1.Errors.COURSE_NOT_FOUND,
        error_1.Errors.COURSE_STATUS_INVALID,
        error_1.Errors.CLASS_STATUS_INVALID,
        error_1.Errors.GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST,
        error_1.Errors.CANCEL_CLASS_REQUEST_CAN_NOT_BE_APPROVED
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, approve_class_request_dto_1.ApproveClassRequestDto]),
    __metadata("design:returntype", Promise)
], ManagementClassRequestController.prototype, "approve", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Reject Publish/Cancel Class Request`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.CLASS_REQUEST_NOT_FOUND,
        error_1.Errors.CLASS_REQUEST_STATUS_INVALID,
        error_1.Errors.COURSE_NOT_FOUND,
        error_1.Errors.COURSE_STATUS_INVALID,
        error_1.Errors.CLASS_NOT_FOUND
    ]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)(':id([0-9a-f]{24})/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reject_class_request_dto_1.RejectClassRequestDto]),
    __metadata("design:returntype", Promise)
], ManagementClassRequestController.prototype, "reject", null);
exports.ManagementClassRequestController = ManagementClassRequestController = __decorate([
    (0, swagger_1.ApiTags)('ClassRequest - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(class_request_service_1.IClassRequestService)),
    __metadata("design:paramtypes", [Object])
], ManagementClassRequestController);
//# sourceMappingURL=management.class-request.controller.js.map