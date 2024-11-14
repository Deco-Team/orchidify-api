export const CERTIFICATE_LIST_PROJECTION = [
  '_id',
  'name',
  'code',
  'url',
  'ownerId',
  'createdAt',
  'updatedAt'
] as const

export const CERTIFICATE_DETAIL_PROJECTION = CERTIFICATE_LIST_PROJECTION
