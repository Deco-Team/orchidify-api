import { HttpStatus } from '@nestjs/common';
export interface ErrorResponse {
    message: string;
    error?: string;
    httpStatus?: HttpStatus;
    data?: Record<string, any>;
}
export declare class AppException extends Error {
    error: any;
    httpStatus: any;
    data: any;
    constructor(params: ErrorResponse);
}
