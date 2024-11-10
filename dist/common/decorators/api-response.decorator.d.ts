import { ErrorResponse } from '@common/exceptions/app.exception';
export declare function ApiErrorResponse(errorResponses?: ErrorResponse[]): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
