export const GARDEN_LIST_PROJECTION = [
  '_id',
  'name',
  'description',
  'address',
  'addressLink',
  'gardenManagerId',
  'status',
  'maxClass',
  'createdAt',
  'updatedAt'
] as const

export const GARDEN_DETAIL_PROJECTION = [
  '_id',
  'name',
  'description',
  'address',
  'addressLink',
  'gardenManagerId',
  'images',
  'status',
  'maxClass',
  'createdAt',
  'updatedAt'
] as const
