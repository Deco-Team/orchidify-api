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
exports.InstructorController = void 0;
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
const instructor_service_1 = require("../services/instructor.service");
const view_instructor_dto_1 = require("../dto/view-instructor.dto");
const constant_2 = require("../contracts/constant");
const update_instructor_profile_dto_1 = require("../dto/update-instructor-profile.dto");
let InstructorController = class InstructorController {
    constructor(instructorService) {
        this.instructorService = instructorService;
    }
    async viewProfile(req) {
        const { _id } = _.get(req, 'user');
        const instructor = await this.instructorService.findById(_id, constant_2.INSTRUCTOR_PROFILE_PROJECTION);
        if (!instructor)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_NOT_FOUND);
        return instructor;
    }
    async viewCertifications(req) {
        const { _id } = _.get(req, 'user');
        const instructor = await this.instructorService.findById(_id, 'certificates');
        if (!instructor)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_NOT_FOUND);
        return { docs: _.get(instructor, 'certificates', []) };
    }
    async updateProfile(req, updateInstructorProfileDto) {
        const { _id } = _.get(req, 'user');
        const instructor = await this.instructorService.update({ _id }, updateInstructorProfileDto);
        if (!instructor)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_NOT_FOUND);
        return new dto_1.SuccessResponse(true);
    }
};
exports.InstructorController = InstructorController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'View instructor profile'
    }),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOkResponse)({ type: view_instructor_dto_1.InstructorProfileDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_NOT_FOUND]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "viewProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'View instructor certifications'
    }),
    (0, common_1.Get)('certifications'),
    (0, swagger_1.ApiOkResponse)({ type: view_instructor_dto_1.InstructorCertificationsDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_NOT_FOUND]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "viewCertifications", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update instructor profile'
    }),
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.INSTRUCTOR_NOT_FOUND]),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_instructor_profile_dto_1.UpdateInstructorProfileDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "updateProfile", null);
exports.InstructorController = InstructorController = __decorate([
    (0, swagger_1.ApiTags)('Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(instructor_service_1.IInstructorService)),
    __metadata("design:paramtypes", [Object])
], InstructorController);
//# sourceMappingURL=instructor.controller.js.map