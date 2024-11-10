"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHILD_COURSE_COMBO_DETAIL_PROJECTION = exports.COURSE_COMBO_DETAIL_PROJECTION = exports.COURSE_COMBO_LIST_PROJECTION = exports.PUBLIC_COURSE_DETAIL_PROJECTION = exports.COURSE_DETAIL_PROJECTION = exports.COURSE_LIST_PROJECTION = void 0;
exports.COURSE_LIST_PROJECTION = [
    '_id',
    'code',
    'title',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'status',
    'learnerLimit',
    'rate',
    'ratingSummary',
    'discount',
    'instructorId',
    'isRequesting',
    'createdAt',
    'updatedAt'
];
exports.COURSE_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'status',
    'sessions',
    'learnerLimit',
    'rate',
    'ratingSummary',
    'discount',
    'gardenRequiredToolkits',
    'instructorId',
    'isRequesting',
    'createdAt',
    'updatedAt'
];
exports.PUBLIC_COURSE_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'status',
    'sessions._id',
    'sessions.title',
    'learnerLimit',
    'rate',
    'ratingSummary',
    'discount',
    'gardenRequiredToolkits',
    'instructorId',
    'isRequesting',
    'createdAt',
    'updatedAt'
];
exports.COURSE_COMBO_LIST_PROJECTION = [
    '_id',
    'code',
    'title',
    'status',
    'childCourseIds',
    'discount',
    'instructorId',
    'createdAt',
    'updatedAt'
];
exports.COURSE_COMBO_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'status',
    'childCourseIds',
    'discount',
    'instructorId',
    'createdAt',
    'updatedAt'
];
exports.CHILD_COURSE_COMBO_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'price',
    'level',
    'type',
    'status',
    'learnerLimit',
    'rate',
    'discount',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map