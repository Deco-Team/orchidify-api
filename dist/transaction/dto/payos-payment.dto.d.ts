import { PayOSStatus } from '@src/transaction/contracts/constant';
export declare class CreatePayOSPaymentResponse {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: PayOSStatus;
    checkoutUrl: string;
    qrCode: string;
}
declare const CreatePayOSPaymentResponseDto_base: import("@nestjs/common").Type<{
    data: typeof CreatePayOSPaymentResponse;
}>;
export declare class CreatePayOSPaymentResponseDto extends CreatePayOSPaymentResponseDto_base {
}
export declare class PayOSPaymentResponseDto {
    id: string;
    orderCode: string;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: PayOSStatus;
    createdAt: string;
    transactions: TransactionType[];
    cancellationReason: string | null;
    canceledAt: string | null;
}
export declare class TransactionType {
    reference: string;
    amount: number;
    accountNumber: string;
    description: string;
    transactionDateTime: string;
    virtualAccountName: string | null;
    virtualAccountNumber: string | null;
    counterAccountBankId: string | null;
    counterAccountBankName: string | null;
    counterAccountName: string | null;
    counterAccountNumber: string | null;
}
export declare class PayOSRefundTransactionDto {
    orderId: string;
    cancellationReason?: string;
}
export {};
