"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYOUT_REQUEST_DETAIL_PROJECTION = exports.PAYOUT_REQUEST_LIST_PROJECTION = void 0;
exports.PAYOUT_REQUEST_LIST_PROJECTION = [
    '_id',
    'amount',
    'status',
    'rejectReason',
    'description',
    'createdBy',
    'hasMadePayout',
    'createdAt',
    'updatedAt'
];
exports.PAYOUT_REQUEST_DETAIL_PROJECTION = [
    '_id',
    'amount',
    'status',
    'rejectReason',
    'histories',
    'description',
    'createdBy',
    'handledBy',
    'transactionId',
    'hasMadePayout',
    'transactionCode',
    'attachment',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map