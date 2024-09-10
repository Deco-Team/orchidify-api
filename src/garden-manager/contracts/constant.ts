export const GARDEN_MANAGER_LIST_PROJECTION = [
  '_id',
  'name',
  'email',
  'idCardPhoto',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const GARDEN_MANAGER_DETAIL_PROJECTION = GARDEN_MANAGER_LIST_PROJECTION
