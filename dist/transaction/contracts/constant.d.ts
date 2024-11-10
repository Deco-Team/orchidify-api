export declare enum PaymentMethod {
    PAY_OS = "PAY_OS",
    MOMO = "MOMO",
    ZALO_PAY = "ZALO_PAY",
    STRIPE = "STRIPE"
}
export declare enum TransactionType {
    PAYMENT = "PAYMENT",
    PAYOUT = "PAYOUT"
}
export declare enum MomoResultCode {
    SUCCESS = 0,
    AUTHORIZED = 9000,
    FAILED = "FAILED"
}
export declare enum PayOSResultCode {
    SUCCESS = "00",
    FAILED = "01",
    INVALID_PARAM = "02"
}
export declare enum PayOSStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}
export declare enum StripeStatus {
    SUCCEEDED = "succeeded",
    PENDING = "pending",
    FAILED = "failed"
}
export declare const TRANSACTION_LIST_PROJECTION: readonly ["_id", "type", "paymentMethod", "amount", "debitAccount", "creditAccount", "description", "status", "createdAt", "updatedAt"];
export declare const TRANSACTION_DETAIL_PROJECTION: readonly ["_id", "type", "paymentMethod", "amount", "debitAccount", "creditAccount", "description", "status", "payment", "payout", "createdAt", "updatedAt"];
