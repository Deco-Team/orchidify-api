import { ConfigService } from '@nestjs/config';
import { UserRole } from '@src/common/contracts/constant';
import { Strategy } from 'passport-jwt';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(configService: ConfigService);
    validate(req: any, payload: RefreshTokenPayload): {
        _id: string;
        role: UserRole;
        refreshToken: any;
    };
}
export type RefreshTokenPayload = {
    sub: string;
    role: UserRole;
    iat?: number;
    exp?: number;
};
export {};
