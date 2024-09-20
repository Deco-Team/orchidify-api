export const INSTRUCTOR_VIEW_COURSE_TEMPLATE_LIST_PROJECTION = [
  '_id',
  'title',
  'price',
  'level',
  'type',
  'status',
  'learnerLimit',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_VIEW_COURSE_TEMPLATE_DETAIL_PROJECTION = [
  '_id',
  'title',
  'description',
  'price',
  'level',
  'type',
  'thumbnail',
  'media',
  'status',
  'learnerLimit',
  'instructorId',
  'lessons',
  'assignments',
  'createdAt',
  'updatedAt'
] as const
