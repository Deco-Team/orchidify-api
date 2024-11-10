import { UserRole } from './constant';
export declare class PaginationQuery {
    page: number;
    limit: number;
    sort: Record<string, 1 | -1>;
}
export declare class SuccessResponse {
    success: boolean;
    constructor(success: boolean);
}
declare const SuccessDataResponse_base: import("@nestjs/common").Type<{
    data: typeof SuccessResponse;
}>;
export declare class SuccessDataResponse extends SuccessDataResponse_base {
}
export declare class IDResponse {
    _id: string;
    constructor(_id: string);
}
declare const IDDataResponse_base: import("@nestjs/common").Type<{
    data: typeof IDResponse;
}>;
export declare class IDDataResponse extends IDDataResponse_base {
}
export declare class ErrorResponse {
    error: string;
    message: string;
    data: any;
}
export declare class UserAuth {
    _id?: string;
    role: UserRole;
}
export {};
