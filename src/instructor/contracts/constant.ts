export const INSTRUCTOR_PROFILE_PROJECTION = [
  '_id',
  'name',
  'phone',
  'email',
  'dateOfBirth',
  'bio',
  'idCardPhoto',
  'avatar',
  'status',
  'balance',
  'paymentInfo'
] as const

export const INSTRUCTOR_DETAIL_PROJECTION = [
  '_id',
  'name',
  'phone',
  'email',
  'dateOfBirth',
  'certificates',
  'bio',
  'idCardPhoto',
  'avatar',
  'status',
  'balance',
  'createdAt',
  'updatedAt'
] as const

export const INSTRUCTOR_LIST_PROJECTION = [
  '_id',
  'name',
  'phone',
  'email',
  'dateOfBirth',
  'bio',
  'idCardPhoto',
  'avatar',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION = ['_id', 'name', 'idCardPhoto', 'avatar', 'bio'] as const

export const VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION = [
  '_id',
  'name',
  'phone',
  'email',
  'dateOfBirth',
  'certificates',
  'bio',
  'idCardPhoto',
  'avatar',
  'status',
  'createdAt',
  'updatedAt'
] as const