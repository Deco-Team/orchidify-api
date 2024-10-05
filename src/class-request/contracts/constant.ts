export const INSTRUCTOR_VIEW_CLASS_REQUEST_LIST_PROJECTION = [
  '_id',
  'type',
  'status',
  'rejectReason',
  'description',
  'metadata',
  'createdBy',
  'courseId',
  'classId',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_VIEW_CLASS_REQUEST_DETAIL_PROJECTION = [
  '_id',
  'type',
  'status',
  'rejectReason',
  'histories',
  'description',
  'metadata',
  'createdBy',
  'courseId',
  'classId',
  'createdAt',
  'updatedAt'
] as const
