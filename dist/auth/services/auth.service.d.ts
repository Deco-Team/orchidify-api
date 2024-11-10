import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@common/contracts/constant';
import { RefreshTokenDto, TokenResponse } from '@auth/dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { SuccessResponse } from '@common/contracts/dto';
import { ILearnerService } from '@learner/services/learner.service';
import { LoginDto } from '@auth/dto/login.dto';
import { IInstructorService } from '@instructor/services/instructor.service';
import { IStaffService } from '@staff/services/staff.service';
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service';
import { IUserTokenService } from './user-token.service';
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto';
import { HelperService } from '@common/services/helper.service';
import { IOtpService } from './otp.service';
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto';
import { IRecruitmentService } from '@recruitment/services/recruitment.service';
import { NotificationAdapter } from '@common/adapters/notification.adapter';
import { ISettingService } from '@setting/services/setting.service';
export interface IAuthUserService {
    findByEmail(email: string, projection?: string | Record<string, any>): any;
    findById(id: string): Promise<any>;
}
export declare const IAuthService: unique symbol;
export interface IAuthService {
    login(loginDto: LoginDto, role: UserRole): Promise<TokenResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<SuccessResponse>;
    refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenResponse>;
    registerByInstructor(instructorRegisterDto: InstructorRegisterDto): Promise<SuccessResponse>;
    registerByLearner(learnerRegisterDto: LearnerRegisterDto): Promise<SuccessResponse>;
    verifyOtpByLearner(learnerVerifyAccountDto: LearnerVerifyAccountDto): Promise<SuccessResponse>;
    resendOtpByLearner(learnerResendOtpDto: LearnerResendOtpDto): Promise<SuccessResponse>;
}
export declare class AuthService implements IAuthService {
    private readonly learnerService;
    private readonly instructorService;
    private readonly staffService;
    private readonly gardenManagerService;
    private readonly userTokenService;
    private readonly otpService;
    private readonly recruitmentService;
    private readonly settingService;
    private readonly jwtService;
    private readonly helperService;
    private readonly configService;
    private readonly notificationAdapter;
    constructor(learnerService: ILearnerService, instructorService: IInstructorService, staffService: IStaffService, gardenManagerService: IGardenManagerService, userTokenService: IUserTokenService, otpService: IOtpService, recruitmentService: IRecruitmentService, settingService: ISettingService, jwtService: JwtService, helperService: HelperService, configService: ConfigService, notificationAdapter: NotificationAdapter);
    private readonly authUserServiceMap;
    login(loginDto: LoginDto, role: UserRole): Promise<TokenResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<SuccessResponse>;
    refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenResponse>;
    registerByLearner(learnerRegisterDto: LearnerRegisterDto): Promise<SuccessResponse>;
    verifyOtpByLearner(learnerVerifyAccountDto: LearnerVerifyAccountDto): Promise<SuccessResponse>;
    resendOtpByLearner(learnerResendOtpDto: LearnerResendOtpDto): Promise<SuccessResponse>;
    registerByInstructor(instructorRegisterDto: InstructorRegisterDto): Promise<SuccessResponse>;
    private generateTokens;
}
