export const PAYOUT_REQUEST_LIST_PROJECTION = [
  '_id',
  'amount',
  'status',
  'rejectReason',
  'description',
  'createdBy',
  'createdAt',
  'updatedAt'
] as const

export const PAYOUT_REQUEST_DETAIL_PROJECTION = [
  '_id',
  'amount',
  'status',
  'rejectReason',
  'histories',
  'description',
  'createdBy',
  'handledBy',
  'transactionId',
  'createdAt',
  'updatedAt'
] as const
