"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_DEVICE_LIST_PROJECTION = exports.NOTIFICATION_LIST_PROJECTION = void 0;
exports.NOTIFICATION_LIST_PROJECTION = ['_id', 'title', 'body', 'data', 'createdAt', 'updatedAt'];
exports.USER_DEVICE_LIST_PROJECTION = [
    '_id',
    'userId',
    'userRole',
    'fcmToken',
    'browser',
    'os',
    'status',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map