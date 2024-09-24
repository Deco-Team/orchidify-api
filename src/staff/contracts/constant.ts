export const STAFF_LIST_PROJECTION = [
  '_id',
  'name',
  'email',
  'staffCode',
  'idCardPhoto',
  'status',
  'role',
  'createdAt',
  'updatedAt'
] as const

export const STAFF_DETAIL_PROJECTION = STAFF_LIST_PROJECTION
