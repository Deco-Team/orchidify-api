export const LEARNER_PROFILE_PROJECTION = ['_id', 'name', 'email', 'avatar', 'dateOfBirth', 'phone', 'status'] as const

export const LEARNER_DETAIL_PROJECTION = [
  '_id',
  'name',
  'email',
  'avatar',
  'dateOfBirth',
  'phone',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const LEARNER_LIST_PROJECTION = LEARNER_DETAIL_PROJECTION
