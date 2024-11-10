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
exports.LearnerAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dto/login.dto");
const dto_1 = require("../../common/contracts/dto");
const token_dto_1 = require("../dto/token.dto");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const learner_register_dto_1 = require("../dto/learner-register.dto");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
let LearnerAuthController = class LearnerAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDto) {
        return this.authService.login(loginDto, constant_1.UserRole.LEARNER);
    }
    async logout(refreshTokenDto) {
        return await this.authService.logout(refreshTokenDto);
    }
    refreshToken(req) {
        return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken);
    }
    async register(LearnerRegisterDto) {
        return await this.authService.registerByLearner(LearnerRegisterDto);
    }
    verifyOtp(LearnerVerifyAccountDto) {
        return this.authService.verifyOtpByLearner(LearnerVerifyAccountDto);
    }
    resendOtp(learnerResendOtpDto) {
        return this.authService.resendOtpByLearner(learnerResendOtpDto);
    }
};
exports.LearnerAuthController = LearnerAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiCreatedResponse)({ type: token_dto_1.TokenDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.WRONG_EMAIL_OR_PASSWORD, error_1.Errors.INACTIVE_ACCOUNT, error_1.Errors.UNVERIFIED_ACCOUNT]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], LearnerAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], LearnerAuthController.prototype, "logout", null);
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
], LearnerAuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.EMAIL_ALREADY_EXIST]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [learner_register_dto_1.LearnerRegisterDto]),
    __metadata("design:returntype", Promise)
], LearnerAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([
        error_1.Errors.LEARNER_NOT_FOUND,
        error_1.Errors.INACTIVE_ACCOUNT,
        error_1.Errors.WRONG_OTP_CODE,
        error_1.Errors.OTP_CODE_IS_EXPIRED
    ]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [learner_register_dto_1.LearnerVerifyAccountDto]),
    __metadata("design:returntype", void 0)
], LearnerAuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiCreatedResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.LEARNER_NOT_FOUND, error_1.Errors.INACTIVE_ACCOUNT, error_1.Errors.RESEND_OTP_CODE_LIMITED]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [learner_register_dto_1.LearnerResendOtpDto]),
    __metadata("design:returntype", void 0)
], LearnerAuthController.prototype, "resendOtp", null);
exports.LearnerAuthController = LearnerAuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth - Learner'),
    (0, common_1.Controller)('learner'),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    __param(0, (0, common_1.Inject)(auth_service_1.IAuthService)),
    __metadata("design:paramtypes", [Object])
], LearnerAuthController);
//# sourceMappingURL=learner.auth.controller.js.map