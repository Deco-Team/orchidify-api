export declare class CreateMomoPaymentDto {
    partnerCode?: string;
    partnerName: string;
    orderInfo: string;
    redirectUrl: string;
    ipnUrl: string;
    requestType: string;
    amount: number;
    orderId: string;
    requestId: string;
    extraData: string;
    autoCapture: boolean;
    lang: 'vi' | 'en';
    orderExpireTime?: number;
    signature?: string;
}
export declare class CreateMomoPaymentResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    shortLink: string;
    deeplink: string;
    qrCodeUrl: string;
}
declare const CreateMomoPaymentDataResponse_base: import("@nestjs/common").Type<{
    data: typeof CreateMomoPaymentResponse;
}>;
export declare class CreateMomoPaymentDataResponse extends CreateMomoPaymentDataResponse_base {
}
export declare class QueryMomoPaymentDto {
    partnerCode?: string;
    orderId: string;
    requestId: string;
    lang: 'vi' | 'en';
    signature?: string;
}
export declare class MomoPaymentResponseDto {
    partnerCode: string;
    orderId: string;
    requestId: string;
    extraData: string;
    amount: number;
    transId: number;
    payType: string;
    resultCode: number;
    refundTrans: MomoRefundTransactionDto[];
    message: string;
    responseTime: number;
    orderInfo?: string;
    orderType?: string;
    signature?: string;
}
export declare class MomoRefundTransactionDto {
    orderId: string;
    amount: number;
    resultCode: number;
    transId: number;
    createdTime: number;
}
export declare class RefundMomoPaymentDto {
    partnerCode?: string;
    orderId: string;
    requestId: string;
    amount: number;
    transId: number;
    lang: 'vi' | 'en';
    description?: string;
    signature?: string;
}
export declare class RefundMomoPaymentResponseDto {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    transId: number;
    resultCode: number;
    message: string;
    responseTime: number;
}
export {};
