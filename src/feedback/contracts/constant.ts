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