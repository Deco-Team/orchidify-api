export const GARDEN_LIST_PROJECTION = [
  '_id',
  'name',
  'description',
  'address',
  'gardenManagerId',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const GARDEN_DETAIL_PROJECTION = [
  '_id',
  'name',
  'description',
  'address',
  'gardenManagerId',
  'images',
  'status',
  'createdAt',
  'updatedAt'
] as const
