export const CLASS_LIST_PROJECTION = [
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
] as const

export const CLASS_DETAIL_PROJECTION = [
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
] as const

// Viewer
export const PUBLIC_COURSE_CLASS_DETAIL_PROJECTION = [
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
] as const

// Garden Manager
export const GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION = [
  '_id',
  'code',
  'title',
  // 'thumbnail',
  // 'learnerLimit',
  // 'learnerQuantity',
  'gardenRequiredToolkits',
  'instructorId',
  // 'gardenId',
  'courseId',
] as const

// Learner
export const LEARNER_VIEW_MY_CLASS_LIST_PROJECTION = [
  '_id',
  'code',
  'title',
  'level',
  'type',
  'thumbnail',
  'status',
  'progress',
  'price'
] as const

export const LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION = [
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
] as const