export const INSTRUCTOR_VIEW_CLASS_LIST_PROJECTION = [
  '_id',
  'title',
  'startDate',
  'price',
  'level',
  'type',
  'duration',
  'status',
  'learnerLimit',
  'learnerQuantity',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_VIEW_CLASS_DETAIL_PROJECTION = [
  '_id',
  'title',
  'description',
  'startDate',
  'price',
  'level',
  'type',
  'duration',
  'thumbnail',
  'media',
  'status',
  'histories',
  'learnerLimit',
  'learnerQuantity',
  'instructorId',
  'gardenId',
  'sessions',
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
