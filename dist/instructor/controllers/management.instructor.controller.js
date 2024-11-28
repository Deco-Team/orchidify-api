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
exports.ManagementInstructorController = void 0;
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
const instructor_service_1 = require("../services/instructor.service");
const constant_2 = require("../contracts/constant");
const view_instructor_dto_1 = require("../dto/view-instructor.dto");
const update_instructor_dto_1 = require("../dto/update-instructor.dto");
const mongoose_1 = require("mongoose");
const class_service_1 = require("../../class/services/class.service");
const create_instructor_dto_1 = require("../dto/create-instructor.dto");
const recruitment_service_1 = require("../../recruitment/services/recruitment.service");
const report_service_1 = require("../../report/services/report.service");
const constant_3 = require("../../report/contracts/constant");
let ManagementInstructorController = class ManagementInstructorController {
    constructor(instructorService, userTokenService, classService, recruitmentService, reportService) {
        this.instructorService = instructorService;
        this.userTokenService = userTokenService;
        this.classService = classService;
        this.recruitmentService = recruitmentService;
        this.reportService = reportService;
    }
    async list(pagination, queryInstructorDto) {
        return await this.instructorService.list(pagination, queryInstructorDto);
    }
    async getDetail(instructorId) {
        const instructor = await this.instructorService.findById(instructorId, constant_2.INSTRUCTOR_DETAIL_PROJECTION);
        if (!instructor)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_NOT_FOUND);
        return instructor;
    }
    async create(createInstructorDto) {
        const existedInstructor = await this.instructorService.findByEmail(createInstructorDto.email);
        if (existedInstructor)
            throw new app_exception_1.AppException(error_1.Errors.EMAIL_ALREADY_EXIST);
        const selectedRecruitment = await this.recruitmentService.findOneByApplicationEmailAndStatus(createInstructorDto.email, [constant_1.RecruitmentStatus.SELECTED]);
        if (!selectedRecruitment)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS);
        const instructor = await this.instructorService.create(createInstructorDto);
        await this.recruitmentService.update({ _id: selectedRecruitment._id }, { $set: { isInstructorAdded: true } });
        this.reportService.update({ type: constant_3.ReportType.InstructorSum, tag: constant_3.ReportTag.System }, {
            $inc: {
                'data.quantity': 1
            }
        });
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        this.reportService.update({ type: constant_3.ReportType.InstructorSumByMonth, tag: constant_3.ReportTag.System, 'data.year': year }, {
            $inc: {
                [`data.${month}.quantity`]: 1
            }
        });
        return new dto_1.IDResponse(instructor._id);
    }
    async update(instructorId, updateInstructorDto) {
        const instructor = await this.instructorService.update({ _id: instructorId }, updateInstructorDto);
        if (!instructor)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_NOT_FOUND);
        return new dto_1.SuccessResponse(true);
    }
    async deactivate(instructorId) {
        const classes = await this.classService.findManyByInstructorIdAndStatus(instructorId, [
            constant_1.ClassStatus.PUBLISHED,
            constant_1.ClassStatus.IN_PROGRESS
        ]);
        if (classes.length > 0)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES);
        await Promise.all([
            this.instructorService.update({
                _id: instructorId
            }, { status: constant_1.InstructorStatus.INACTIVE }),
            this.userTokenService.clearAllRefreshTokensOfUser(new mongoose_1.Types.ObjectId(instructorId), constant_1.UserRole.INSTRUCTOR)
        ]);
        return new dto_1.SuccessResponse(true);
    }
    async activate(instructorId) {
        await this.instructorService.update({
            _id: instructorId
        }, { status: constant_1.InstructorStatus.ACTIVE });
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementInstructorController = ManagementInstructorController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Instructor List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_instructor_dto_1.InstructorListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_instructor_dto_1.QueryInstructorDto]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Instructor Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_instructor_dto_1.InstructorDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "getDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Add Instructor`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.IDDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.EMAIL_ALREADY_EXIST, error_1.Errors.INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_instructor_dto_1.CreateInstructorDto]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Update Instructor`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Put)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Deactivate Instructor`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Activate Instructor`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Patch)('/:id([0-9a-f]{24})/active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementInstructorController.prototype, "activate", null);
exports.ManagementInstructorController = ManagementInstructorController = __decorate([
    (0, swagger_1.ApiTags)('Instructor - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(instructor_service_1.IInstructorService)),
    __param(1, (0, common_1.Inject)(user_token_service_1.IUserTokenService)),
    __param(2, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(3, (0, common_1.Inject)(recruitment_service_1.IRecruitmentService)),
    __param(4, (0, common_1.Inject)(report_service_1.IReportService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ManagementInstructorController);
//# sourceMappingURL=management.instructor.controller.js.map