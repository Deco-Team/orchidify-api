"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_DETAIL_PROJECTION = exports.TRANSACTION_LIST_PROJECTION = exports.StripeStatus = exports.PayOSStatus = exports.PayOSResultCode = exports.MomoResultCode = exports.TransactionType = exports.PaymentMethod = void 0;
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PAY_OS"] = "PAY_OS";
    PaymentMethod["MOMO"] = "MOMO";
    PaymentMethod["ZALO_PAY"] = "ZALO_PAY";
    PaymentMethod["STRIPE"] = "STRIPE";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "PAYMENT";
    TransactionType["PAYOUT"] = "PAYOUT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var MomoResultCode;
(function (MomoResultCode) {
    MomoResultCode[MomoResultCode["SUCCESS"] = 0] = "SUCCESS";
    MomoResultCode[MomoResultCode["AUTHORIZED"] = 9000] = "AUTHORIZED";
    MomoResultCode["FAILED"] = "FAILED";
})(MomoResultCode || (exports.MomoResultCode = MomoResultCode = {}));
var PayOSResultCode;
(function (PayOSResultCode) {
    PayOSResultCode["SUCCESS"] = "00";
    PayOSResultCode["FAILED"] = "01";
    PayOSResultCode["INVALID_PARAM"] = "02";
})(PayOSResultCode || (exports.PayOSResultCode = PayOSResultCode = {}));
var PayOSStatus;
(function (PayOSStatus) {
    PayOSStatus["PENDING"] = "PENDING";
    PayOSStatus["PROCESSING"] = "PROCESSING";
    PayOSStatus["PAID"] = "PAID";
    PayOSStatus["CANCELLED"] = "CANCELLED";
})(PayOSStatus || (exports.PayOSStatus = PayOSStatus = {}));
var StripeStatus;
(function (StripeStatus) {
    StripeStatus["SUCCEEDED"] = "succeeded";
    StripeStatus["PENDING"] = "pending";
    StripeStatus["FAILED"] = "failed";
})(StripeStatus || (exports.StripeStatus = StripeStatus = {}));
exports.TRANSACTION_LIST_PROJECTION = [
    '_id',
    'type',
    'paymentMethod',
    'amount',
    'debitAccount',
    'creditAccount',
    'description',
    'status',
    'createdAt',
    'updatedAt'
];
exports.TRANSACTION_DETAIL_PROJECTION = [
    '_id',
    'type',
    'paymentMethod',
    'amount',
    'debitAccount',
    'creditAccount',
    'description',
    'status',
    'payment',
    'payout',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map