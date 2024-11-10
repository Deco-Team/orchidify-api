import { IPaymentStrategy } from '@src/transaction/strategies/payment-strategy.interface';
export declare class ZaloPayPaymentStrategy implements IPaymentStrategy {
    createTransaction(data: any): void;
    getTransaction(queryDto: any): any;
    refundTransaction(refundDto: any): any;
    getRefundTransaction(queryRefundDto: any): any;
    processWebhook(webhookData: any): void;
    verifyPaymentWebhookData(webhookData: any): any;
}
