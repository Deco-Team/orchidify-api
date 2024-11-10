export const COURSE_LIST_PROJECTION = [
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
] as const

export const COURSE_DETAIL_PROJECTION = [
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
] as const

export const PUBLIC_COURSE_DETAIL_PROJECTION = [
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
] as const

export const COURSE_COMBO_LIST_PROJECTION = [
  '_id',
  'code',
  'title',
  'status',
  'childCourseIds',
  'discount',
  'instructorId',
  'createdAt',
  'updatedAt'
] as const

export const COURSE_COMBO_DETAIL_PROJECTION = [
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
] as const

export const CHILD_COURSE_COMBO_DETAIL_PROJECTION = [
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
] as const
