export const PAYOUT_REQUEST_LIST_PROJECTION = [
  '_id',
  'amount',
  'status',
  'rejectReason',
  'description',
  'createdBy',
  'hasMadePayout',
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
  'hasMadePayout',
  'transactionCode',
  'attachment',
  'createdAt',
  'updatedAt'
] as const
