export const NOTIFICATION_LIST_PROJECTION = ['_id', 'title', 'body', 'data', 'createdAt', 'updatedAt'] as const

export const USER_DEVICE_LIST_PROJECTION = [
  '_id',
  'userId',
  'userRole',
  'fcmToken',
  'browser',
  'os',
  'status',
  'createdAt',
  'updatedAt'
] as const
