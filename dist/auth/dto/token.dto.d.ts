export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class TokenResponse {
    accessToken: string;
    refreshToken: string;
}
declare const TokenDataResponse_base: import("@nestjs/common").Type<{
    data: typeof TokenResponse;
}>;
export declare class TokenDataResponse extends TokenDataResponse_base {
}
export {};
