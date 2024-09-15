export enum CourseLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export const INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION = [
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

export const INSTRUCTOR_VIEW_COURSE_DETAIL_PROJECTION = [
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
  'lessons',
  'assignments',
  'createdAt',
  'updatedAt'
] as const
