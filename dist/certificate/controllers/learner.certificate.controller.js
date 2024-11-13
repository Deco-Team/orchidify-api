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
exports.LearnerCertificateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const certificate_service_1 = require("../services/certificate.service");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const view_certificate_dto_1 = require("../dto/view-certificate.dto");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const error_1 = require("../../common/contracts/error");
const constant_2 = require("../contracts/constant");
const app_exception_1 = require("../../common/exceptions/app.exception");
let LearnerCertificateController = class LearnerCertificateController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    async list(req, pagination, queryStaffDto) {
        const { _id } = _.get(req, 'user');
        queryStaffDto.ownerId = _id;
        pagination.limit = 99;
        return await this.certificateService.list(pagination, queryStaffDto);
    }
    async getDetail(req, certificateId) {
        const { _id } = _.get(req, 'user');
        const certificate = await this.certificateService.findById(certificateId, constant_2.CERTIFICATE_DETAIL_PROJECTION);
        if (!certificate || certificate.ownerId.toString() !== _id)
            throw new app_exception_1.AppException(error_1.Errors.CERTIFICATE_NOT_FOUND);
        return certificate;
    }
};
exports.LearnerCertificateController = LearnerCertificateController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Certification List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_certificate_dto_1.CertificateListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_certificate_dto_1.QueryCertificateDto]),
    __metadata("design:returntype", Promise)
], LearnerCertificateController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Certification Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_certificate_dto_1.CertificateDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.CERTIFICATE_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearnerCertificateController.prototype, "getDetail", null);
exports.LearnerCertificateController = LearnerCertificateController = __decorate([
    (0, swagger_1.ApiTags)('Certificate - Learner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Controller)('learners'),
    __param(0, (0, common_1.Inject)(certificate_service_1.ICertificateService)),
    __metadata("design:paramtypes", [Object])
], LearnerCertificateController);
//# sourceMappingURL=learner.certificate.controller.js.map