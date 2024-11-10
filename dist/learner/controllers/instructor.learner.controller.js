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
exports.InstructorLearnerController = void 0;
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
const learner_service_1 = require("../services/learner.service");
const view_learner_dto_1 = require("../dto/view-learner.dto");
const constant_2 = require("../contracts/constant");
let InstructorLearnerController = class InstructorLearnerController {
    constructor(learnerService) {
        this.learnerService = learnerService;
    }
    async getDetail(learnerId) {
        const learner = await this.learnerService.findById(learnerId, constant_2.LEARNER_DETAIL_PROJECTION);
        if (!learner)
            throw new app_exception_1.AppException(error_1.Errors.LEARNER_NOT_FOUND);
        return learner;
    }
};
exports.InstructorLearnerController = InstructorLearnerController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Learner Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_learner_dto_1.LearnerDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.LEARNER_NOT_FOUND]),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorLearnerController.prototype, "getDetail", null);
exports.InstructorLearnerController = InstructorLearnerController = __decorate([
    (0, swagger_1.ApiTags)('Learner - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(learner_service_1.ILearnerService)),
    __metadata("design:paramtypes", [Object])
], InstructorLearnerController);
//# sourceMappingURL=instructor.learner.controller.js.map