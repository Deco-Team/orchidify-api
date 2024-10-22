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
  'cancelReason',
  'gardenRequiredToolkits',
  'instructorId',
  'gardenId',
  'courseId',
  'createdAt',
  'updatedAt'
] as const

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

export const GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION = [
  '_id',
  'code',
  'title',
  // 'thumbnail',
  // 'learnerLimit',
  // 'learnerQuantity',
  'gardenRequiredToolkits',
  // 'instructorId',
  // 'gardenId',
  // 'courseId',
] as const