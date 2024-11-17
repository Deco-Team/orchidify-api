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
exports.AuthService = exports.IAuthService = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const error_1 = require("../../common/contracts/error");
const constant_1 = require("../../common/contracts/constant");
const config_1 = require("@nestjs/config");
const dto_1 = require("../../common/contracts/dto");
const learner_service_1 = require("../../learner/services/learner.service");
const app_exception_1 = require("../../common/exceptions/app.exception");
const instructor_service_1 = require("../../instructor/services/instructor.service");
const staff_service_1 = require("../../staff/services/staff.service");
const garden_manager_service_1 = require("../../garden-manager/services/garden-manager.service");
const user_token_service_1 = require("./user-token.service");
const helper_service_1 = require("../../common/services/helper.service");
const otp_service_1 = require("./otp.service");
const mongoose_1 = require("mongoose");
const recruitment_service_1 = require("../../recruitment/services/recruitment.service");
const setting_service_1 = require("../../setting/services/setting.service");
const constant_2 = require("../../setting/contracts/constant");
const notification_service_1 = require("../../notification/services/notification.service");
exports.IAuthService = Symbol('IAuthService');
let AuthService = class AuthService {
    constructor(learnerService, instructorService, staffService, gardenManagerService, userTokenService, otpService, recruitmentService, settingService, jwtService, helperService, configService, notificationService) {
        this.learnerService = learnerService;
        this.instructorService = instructorService;
        this.staffService = staffService;
        this.gardenManagerService = gardenManagerService;
        this.userTokenService = userTokenService;
        this.otpService = otpService;
        this.recruitmentService = recruitmentService;
        this.settingService = settingService;
        this.jwtService = jwtService;
        this.helperService = helperService;
        this.configService = configService;
        this.notificationService = notificationService;
        this.authUserServiceMap = {
            [constant_1.UserRole.LEARNER]: this.learnerService,
            [constant_1.UserRole.INSTRUCTOR]: this.instructorService,
            [constant_1.UserRole.STAFF]: this.staffService,
            [constant_1.UserRole.ADMIN]: this.staffService,
            [constant_1.UserRole.GARDEN_MANAGER]: this.gardenManagerService
        };
    }
    async login(loginDto, role) {
        const user = await this.authUserServiceMap[role].findByEmail(loginDto.email, '+password');
        if (!user)
            throw new app_exception_1.AppException(error_1.Errors.WRONG_EMAIL_OR_PASSWORD);
        if (user.status === constant_1.LearnerStatus.UNVERIFIED)
            throw new app_exception_1.AppException(error_1.Errors.UNVERIFIED_ACCOUNT);
        if ([constant_1.LearnerStatus.INACTIVE, constant_1.InstructorStatus.INACTIVE, constant_1.StaffStatus.INACTIVE, constant_1.GardenManagerStatus.INACTIVE].includes(user.status))
            throw new app_exception_1.AppException(error_1.Errors.INACTIVE_ACCOUNT);
        const isPasswordMatch = await this.helperService.comparePassword(loginDto.password, user.password);
        if (!isPasswordMatch)
            throw new common_1.BadRequestException(error_1.Errors.WRONG_EMAIL_OR_PASSWORD.message);
        const userRole = user.role ?? role;
        const accessTokenPayload = { sub: user._id, role: userRole, name: user.name };
        const refreshTokenPayload = { sub: user._id, role: userRole };
        const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload);
        await this.userTokenService.create({ userId: user._id, role: userRole, refreshToken: tokens.refreshToken });
        return tokens;
    }
    async logout(refreshTokenDto) {
        await this.userTokenService.disableRefreshToken(refreshTokenDto.refreshToken);
        return new dto_1.SuccessResponse(true);
    }
    async refreshToken(id, role, refreshToken) {
        const userToken = await this.userTokenService.findByRefreshToken(refreshToken);
        if (!userToken || userToken.enabled === false)
            throw new app_exception_1.AppException(error_1.Errors.REFRESH_TOKEN_INVALID);
        const user = await this.authUserServiceMap[role].findById(id);
        if (!user)
            throw new app_exception_1.AppException(error_1.Errors.REFRESH_TOKEN_INVALID);
        const accessTokenPayload = { sub: user._id, role, name: user.name };
        const refreshTokenPayload = { sub: user._id, role };
        const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload);
        await this.userTokenService.update({ _id: userToken._id }, { refreshToken: tokens.refreshToken });
        return tokens;
    }
    async registerByLearner(learnerRegisterDto) {
        const existedLearner = await this.learnerService.findByEmail(learnerRegisterDto.email);
        if (existedLearner)
            throw new app_exception_1.AppException(error_1.Errors.EMAIL_ALREADY_EXIST);
        const password = await this.helperService.hashPassword(learnerRegisterDto.password);
        const learner = await this.learnerService.create({
            name: learnerRegisterDto.name,
            email: learnerRegisterDto.email,
            status: constant_1.LearnerStatus.UNVERIFIED,
            password
        });
        const code = this.helperService.generateRandomString(6);
        await this.otpService.create({
            code,
            userId: new mongoose_1.Types.ObjectId(learner._id),
            role: constant_1.UserRole.LEARNER,
            expiredAt: new Date(Date.now() + 5 * 60000)
        });
        this.notificationService.sendMail({
            to: learner.email,
            subject: `[Orchidify] Account Verification`,
            template: 'learner/verify-account',
            context: {
                code,
                name: learner.name,
                expirationMinutes: 5
            }
        });
        return new dto_1.SuccessResponse(true);
    }
    async verifyOtpByLearner(learnerVerifyAccountDto) {
        const learner = await this.learnerService.findByEmail(learnerVerifyAccountDto.email);
        if (!learner)
            throw new app_exception_1.AppException(error_1.Errors.LEARNER_NOT_FOUND);
        if (learner.status === constant_1.LearnerStatus.INACTIVE)
            throw new app_exception_1.AppException(error_1.Errors.INACTIVE_ACCOUNT);
        if (learner.status === constant_1.LearnerStatus.ACTIVE)
            return new dto_1.SuccessResponse(true);
        const otp = await this.otpService.findByCode(learnerVerifyAccountDto.code);
        if (!otp || otp.userId?.toString() !== learner._id?.toString() || otp.role !== constant_1.UserRole.LEARNER)
            throw new app_exception_1.AppException(error_1.Errors.WRONG_OTP_CODE);
        if (otp.expiredAt < new Date())
            throw new app_exception_1.AppException(error_1.Errors.OTP_CODE_IS_EXPIRED);
        await Promise.all([
            this.learnerService.update({ _id: learner._id }, { status: constant_1.LearnerStatus.ACTIVE }),
            this.otpService.clearOtp(learnerVerifyAccountDto.code)
        ]);
        return new dto_1.SuccessResponse(true);
    }
    async resendOtpByLearner(learnerResendOtpDto) {
        const learner = await this.learnerService.findByEmail(learnerResendOtpDto.email);
        if (!learner)
            throw new app_exception_1.AppException(error_1.Errors.LEARNER_NOT_FOUND);
        if (learner.status === constant_1.LearnerStatus.INACTIVE)
            throw new app_exception_1.AppException(error_1.Errors.INACTIVE_ACCOUNT);
        if (learner.status === constant_1.LearnerStatus.ACTIVE)
            return new dto_1.SuccessResponse(true);
        const resendOtpCodeLimit = Number((await this.settingService.findByKey(constant_2.SettingKey.ResendOtpCodeLimit)).value) || 5;
        const otp = await this.otpService.findByUserIdAndRole(learner._id, constant_1.UserRole.LEARNER);
        if (otp.__v >= resendOtpCodeLimit && moment(otp['updatedAt']).isSame(new Date(), 'day'))
            throw new app_exception_1.AppException(error_1.Errors.RESEND_OTP_CODE_LIMITED);
        const code = this.helperService.generateRandomString(6);
        otp.code = code;
        otp.expiredAt = new Date(Date.now() + 5 * 60000);
        otp.__v++;
        await otp.save();
        this.notificationService.sendMail({
            to: learner.email,
            subject: `[Orchidify] Resend Account Verification`,
            template: 'learner/verify-account',
            context: {
                code,
                name: learner.name,
                expirationMinutes: 5
            }
        });
        return new dto_1.SuccessResponse(true);
    }
    async registerByInstructor(instructorRegisterDto) {
        const existedInstructor = await this.instructorService.findByEmail(instructorRegisterDto.email);
        if (existedInstructor)
            throw new app_exception_1.AppException(error_1.Errors.EMAIL_ALREADY_EXIST);
        const inProgressingRecruitment = await this.recruitmentService.findOneByApplicationEmailAndStatus(instructorRegisterDto.email, [constant_1.RecruitmentStatus.PENDING, constant_1.RecruitmentStatus.INTERVIEWING, constant_1.RecruitmentStatus.SELECTED]);
        if (inProgressingRecruitment)
            throw new app_exception_1.AppException(error_1.Errors.INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS);
        await this.recruitmentService.create({
            applicationInfo: instructorRegisterDto,
            status: constant_1.RecruitmentStatus.PENDING,
            histories: [
                {
                    status: constant_1.RecruitmentStatus.PENDING,
                    timestamp: new Date()
                }
            ]
        });
        this.notificationService.sendMail({
            to: instructorRegisterDto.email,
            subject: `[Orchidify] Confirmation of receipt of application`,
            template: 'viewer/register-instructor-success',
            context: {
                name: instructorRegisterDto.name,
                daysToRespond: 7
            }
        });
        return new dto_1.SuccessResponse(true);
    }
    generateTokens(accessTokenPayload, refreshTokenPayload) {
        return {
            accessToken: this.jwtService.sign(accessTokenPayload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
            }),
            refreshToken: this.jwtService.sign(refreshTokenPayload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
            })
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(learner_service_1.ILearnerService)),
    __param(1, (0, common_1.Inject)(instructor_service_1.IInstructorService)),
    __param(2, (0, common_1.Inject)(staff_service_1.IStaffService)),
    __param(3, (0, common_1.Inject)(garden_manager_service_1.IGardenManagerService)),
    __param(4, (0, common_1.Inject)(user_token_service_1.IUserTokenService)),
    __param(5, (0, common_1.Inject)(otp_service_1.IOtpService)),
    __param(6, (0, common_1.Inject)(recruitment_service_1.IRecruitmentService)),
    __param(7, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __param(11, (0, common_1.Inject)(notification_service_1.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, jwt_1.JwtService,
        helper_service_1.HelperService,
        config_1.ConfigService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map