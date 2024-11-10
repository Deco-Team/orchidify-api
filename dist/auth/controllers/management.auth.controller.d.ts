import { IAuthService } from '@auth/services/auth.service';
import { ManagementLoginDto } from '@auth/dto/login.dto';
import { RefreshTokenDto } from '@auth/dto/token.dto';
export declare class ManagementAuthController {
    private readonly authService;
    constructor(authService: IAuthService);
    login(loginDto: ManagementLoginDto): Promise<import("@auth/dto/token.dto").TokenResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<import("@common/contracts/dto").SuccessResponse>;
    refreshToken(req: any): Promise<import("@auth/dto/token.dto").TokenResponse>;
}
