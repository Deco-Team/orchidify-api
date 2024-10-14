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
  'discount',
  'instructorId',
  'isPublished',
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
  'discount',
  'gardenRequiredToolkits',
  'instructorId',
  'isPublished',
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
  'discount',
  'gardenRequiredToolkits',
  'instructorId',
  'isPublished',
  'createdAt',
  'updatedAt'
] as const
