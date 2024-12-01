export const VIEW_GARDEN_TIMESHEET_LIST_PROJECTION = [
  '_id',
  'status',
  'date',
  'gardenId',
  'slots',
  'gardenMaxClass'
  // 'createdAt',
  // 'updatedAt'
] as const

export const SLOT_CLASS_DETAIL_PROJECTION = [
  'code',
  'title',
  'learnerLimit',
  'learnerQuantity',
  'courseId',
  'gardenRequiredToolkits'
] as const
