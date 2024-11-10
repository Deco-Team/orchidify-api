"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION = exports.LEARNER_VIEW_MY_CLASS_LIST_PROJECTION = exports.GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION = exports.PUBLIC_COURSE_CLASS_DETAIL_PROJECTION = exports.CLASS_DETAIL_PROJECTION = exports.CLASS_LIST_PROJECTION = void 0;
exports.CLASS_LIST_PROJECTION = [
    '_id',
    'code',
    'title',
    'startDate',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'status',
    'learnerLimit',
    'learnerQuantity',
    'weekdays',
    'slotNumbers',
    'rate',
    'ratingSummary',
    'courseId',
    'createdAt',
    'updatedAt'
];
exports.CLASS_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'startDate',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'sessions',
    'status',
    'histories',
    'learnerLimit',
    'learnerQuantity',
    'weekdays',
    'slotNumbers',
    'rate',
    'ratingSummary',
    'cancelReason',
    'gardenRequiredToolkits',
    'instructorId',
    'gardenId',
    'courseId',
    'createdAt',
    'updatedAt'
];
exports.PUBLIC_COURSE_CLASS_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'startDate',
    'duration',
    'status',
    'learnerLimit',
    'learnerQuantity',
    'weekdays',
    'slotNumbers',
    'gardenId'
];
exports.GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'gardenRequiredToolkits',
    'instructorId',
    'courseId',
];
exports.LEARNER_VIEW_MY_CLASS_LIST_PROJECTION = [
    '_id',
    'code',
    'title',
    'level',
    'type',
    'thumbnail',
    'status',
    'progress',
    'price'
];
exports.LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION = [
    '_id',
    'code',
    'title',
    'description',
    'startDate',
    'price',
    'level',
    'type',
    'duration',
    'thumbnail',
    'media',
    'sessions',
    'status',
    'histories',
    'learnerLimit',
    'learnerQuantity',
    'weekdays',
    'slotNumbers',
    'rate',
    'ratingSummary',
    'cancelReason',
    'gardenRequiredToolkits',
    'instructorId',
    'gardenId',
    'courseId',
    'progress',
    'createdAt',
    'updatedAt'
];
//# sourceMappingURL=constant.js.map