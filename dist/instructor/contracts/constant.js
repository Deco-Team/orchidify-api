"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION = exports.MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION = exports.COURSE_INSTRUCTOR_DETAIL_PROJECTION = exports.INSTRUCTOR_LIST_PROJECTION = exports.INSTRUCTOR_DETAIL_PROJECTION = exports.INSTRUCTOR_PROFILE_PROJECTION = void 0;
exports.INSTRUCTOR_PROFILE_PROJECTION = [
    '_id',
    'name',
    'phone',
    'email',
    'dateOfBirth',
    'bio',
    'idCardPhoto',
    'avatar',
    'status',
    'balance',
    'paymentInfo'
];
exports.INSTRUCTOR_DETAIL_PROJECTION = [
    '_id',
    'name',
    'phone',
    'email',
    'dateOfBirth',
    'certificates',
    'bio',
    'idCardPhoto',
    'avatar',
    'status',
    'balance',
    'createdAt',
    'updatedAt'
];
exports.INSTRUCTOR_LIST_PROJECTION = [
    '_id',
    'name',
    'phone',
    'email',
    'dateOfBirth',
    'bio',
    'idCardPhoto',
    'avatar',
    'status',
    'createdAt',
    'updatedAt'
];
exports.COURSE_INSTRUCTOR_DETAIL_PROJECTION = ['_id', 'name', 'email', 'idCardPhoto', 'avatar', 'bio'];
exports.MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION = ['_id', 'name', 'idCardPhoto', 'avatar', 'bio'];
exports.VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION = [
    '_id',
    'name',
    'phone',
    'email',
    'dateOfBirth',
    'certificates',
    'bio',
    'idCardPhoto',
    'avatar',
    'status',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map