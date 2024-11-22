export const FEEDBACK_LEANER_DETAIL = ['_id', 'name', 'avatar', 'phone', 'email', 'dateOfBirth'] as const

export const FEEDBACK_DETAIL_PROJECTION = [
  '_id',
  'rate',
  'comment',
  'learnerId',
  'classId',
  'createdAt',
  'updatedAt'
] as const

export const FEEDBACK_LIST_PROJECTION = [
  '_id',
  'rate',
  'comment',
  'learnerId',
  'classId',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_VIEW_FEEDBACK_LIST_PROJECTION = [
  '_id',
  'rate',
  'comment',
  'classId',
  'createdAt',
  'updatedAt'
] as const
