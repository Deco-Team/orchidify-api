export const INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION = [
  '_id',
  'code',
  'title',
  'price',
  'level',
  'type',
  'status',
  'learnerLimit',
  'rate',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_VIEW_COURSE_DETAIL_PROJECTION = [
  '_id',
  'code',
  'title',
  'description',
  'price',
  'level',
  'type',
  'thumbnail',
  'media',
  'status',
  'lessons',
  'assignments',
  'learnerLimit',
  'rate',
  'gardenRequiredToolkits',
  'instructorId',
  'createdAt',
  'updatedAt'
] as const
