import { ConfigService } from '@nestjs/config';
import { UserRole } from '@src/common/contracts/constant';
import { Strategy } from 'passport-jwt';
declare const JwtAccessStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: AccessTokenPayload): {
        _id: string;
        name: string;
        role: UserRole;
    };
}
export type AccessTokenPayload = {
    name: string;
    sub: string;
    role: UserRole;
    iat?: number;
    exp?: number;
};
export {};
