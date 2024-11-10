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
exports.InstructorAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dto/login.dto");
const dto_1 = require("../../common/contracts/dto");
const token_dto_1 = require("../dto/token.dto");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const instructor_register_dto_1 = require("../dto/instructor-register.dto");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const error_1 = require("../../common/contracts/error");
let InstructorAuthController = class InstructorAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDto) {
        return this.authService.login(loginDto, constant_1.UserRole.INSTRUCTOR);
    }
    async logout(refreshTokenDto) {
        return await this.authService.logout(refreshTokenDto);
    }
    refreshToken(req) {
        return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken);
    }
    async register(instructorRegisterDto) {
        return await this.authService.registerByInstructor(instructorRegisterDto);
    }
};
exports.InstructorAuthController = InstructorAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiCreatedResponse)({ type: token_dto_1.TokenDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.WRONG_EMAIL_OR_PASSWORD, error_1.Errors.INACTIVE_ACCOUNT]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], InstructorAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], InstructorAuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.REFRESH_TOKEN),
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiCreatedResponse)({ type: token_dto_1.TokenDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.REFRESH_TOKEN_INVALID]),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InstructorAuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.EMAIL_ALREADY_EXIST, error_1.Errors.INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [instructor_register_dto_1.InstructorRegisterDto]),
    __metadata("design:returntype", Promise)
], InstructorAuthController.prototype, "register", null);
exports.InstructorAuthController = InstructorAuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth - Instructor'),
    (0, common_1.Controller)('instructor'),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    __param(0, (0, common_1.Inject)(auth_service_1.IAuthService)),
    __metadata("design:paramtypes", [Object])
], InstructorAuthController);
//# sourceMappingURL=instructor.auth.controller.js.map