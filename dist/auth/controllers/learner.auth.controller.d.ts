import { IAuthService } from '@auth/services/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { RefreshTokenDto } from '@auth/dto/token.dto';
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto';
export declare class LearnerAuthController {
    private readonly authService;
    constructor(authService: IAuthService);
    login(loginDto: LoginDto): Promise<import("@auth/dto/token.dto").TokenResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    refreshToken(req: any): Promise<import("@auth/dto/token.dto").TokenResponse>;
    register(LearnerRegisterDto: LearnerRegisterDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    verifyOtp(LearnerVerifyAccountDto: LearnerVerifyAccountDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    resendOtp(learnerResendOtpDto: LearnerResendOtpDto): Promise<import("@common/contracts/dto").SuccessResponse>;
}
