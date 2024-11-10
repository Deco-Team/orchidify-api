import { IAuthService } from '@auth/services/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { RefreshTokenDto } from '@auth/dto/token.dto';
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto';
export declare class InstructorAuthController {
    private readonly authService;
    constructor(authService: IAuthService);
    login(loginDto: LoginDto): Promise<import("@auth/dto/token.dto").TokenResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    refreshToken(req: any): Promise<import("@auth/dto/token.dto").TokenResponse>;
    register(instructorRegisterDto: InstructorRegisterDto): Promise<import("@common/contracts/dto").SuccessResponse>;
}
