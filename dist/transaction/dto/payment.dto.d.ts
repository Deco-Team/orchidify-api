import { TransactionStatus } from '@common/contracts/constant';
import { PaymentMethod } from '@src/transaction/contracts/constant';
import { PayOSPaymentResponseDto } from './payos-payment.dto';
export declare class PaymentDto {
    _id: string;
    transactionStatus: TransactionStatus;
    transaction: PayOSPaymentResponseDto;
    transactionHistory: PayOSPaymentResponseDto[];
    paymentMethod: PaymentMethod;
    amount: number;
}
declare const PaymentPaginateResponseDto_base: import("@nestjs/common").Type<{
    data: {
        new (...args: any[]): {
            docs: (typeof PaymentDto)[];
            totalDocs: number;
            offset: number;
            limit: number;
            totalPages: number;
            page?: number;
            pagingCounter: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            prevPage?: number;
            nextPage?: number;
        };
        apply(this: Function, thisArg: any, argArray?: any): any;
        call(this: Function, thisArg: any, ...argArray: any[]): any;
        bind(this: Function, thisArg: any, ...argArray: any[]): any;
        toString(): string;
        readonly length: number;
        arguments: any;
        caller: Function;
        readonly name: string;
        [Symbol.hasInstance](value: any): boolean;
    };
}>;
export declare class PaymentPaginateResponseDto extends PaymentPaginateResponseDto_base {
}
export {};
